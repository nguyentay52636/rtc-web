"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useUser } from '@clerk/nextjs';

interface VideoCallState {
    isInCall: boolean;
    isCaller: boolean;
    isReceiver: boolean;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isLocalVideoEnabled: boolean;
    isLocalAudioEnabled: boolean;
    isRemoteVideoEnabled: boolean;
    isRemoteAudioEnabled: boolean;
    callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
    callDuration: number;
    targetUser: any | null;
    callerUser: any | null;
    showCameraPermission: boolean;
    isRequestingPermission: boolean;
    incomingOffer?: RTCSessionDescriptionInit | null;
}

interface VideoCallContextType extends VideoCallState {
    startVideoCall: (targetUserId: string) => Promise<void>;
    acceptCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    toggleLocalVideo: () => void;
    toggleLocalAudio: () => void;
    requestCameraPermission: () => Promise<boolean>;
    grantCameraPermission: () => Promise<void>;
    denyCameraPermission: () => void;
}

const VideoCallContext = createContext<VideoCallContextType | null>(null);

export const VideoCallProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket, onlineUsers } = useSocket();
    const { user } = useUser();

    const [state, setState] = useState<VideoCallState>({
        isInCall: false,
        isCaller: false,
        isReceiver: false,
        localStream: null,
        remoteStream: null,
        isLocalVideoEnabled: true,
        isLocalAudioEnabled: true,
        isRemoteVideoEnabled: true,
        isRemoteAudioEnabled: true,
        callStatus: 'idle',
        callDuration: 0,
        targetUser: null,
        callerUser: null,
        showCameraPermission: false,
        isRequestingPermission: false,
        incomingOffer: null,
    });

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const callTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Buffer ICE candidates that arrive before remoteDescription is set
    const pendingRemoteCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    };

    const requestCameraPermission = useCallback(async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            return false;
        }
    }, []);

    const grantCameraPermission = useCallback(async (): Promise<void> => {
        setState(prev => ({ ...prev, isRequestingPermission: true }));
        try {
            const hasPermission = await requestCameraPermission();
            setState(prev => ({ ...prev, showCameraPermission: false, isRequestingPermission: false }));
            if (!hasPermission) alert('Cần quyền truy cập camera và microphone để thực hiện cuộc gọi video');
        } catch (error) {
            console.error('Failed to grant camera permission:', error);
            setState(prev => ({ ...prev, showCameraPermission: false, isRequestingPermission: false }));
            alert('Không thể truy cập camera/microphone');
        }
    }, [requestCameraPermission]);

    const denyCameraPermission = useCallback(() => {
        setState(prev => ({ ...prev, showCameraPermission: false, isRequestingPermission: false }));
    }, []);

    const initializeLocalStream = useCallback(async (): Promise<MediaStream | null> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setState(prev => ({
                ...prev,
                localStream: stream,
                isLocalVideoEnabled: true,
                isLocalAudioEnabled: true,
            }));
            return stream;
        } catch (error) {
            console.error('Failed to get user media:', error);
            return null;
        }
    }, []);

    // Drain buffered ICE candidates after remoteDescription is set
    const drainPendingCandidates = useCallback(async () => {
        if (!peerConnection.current) return;
        const pc = peerConnection.current;
        if (!pc.remoteDescription) return;
        const queued = pendingRemoteCandidatesRef.current;
        pendingRemoteCandidatesRef.current = [];
        for (const cand of queued) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (e) {
                console.error('Error adding buffered ICE candidate', e);
            }
        }
    }, []);

    // Create peer connection, immediately attach provided stream tracks
    const createPeerConnection = useCallback((stream?: MediaStream) => {
        if (peerConnection.current) peerConnection.current.close();
        pendingRemoteCandidatesRef.current = [];

        const pc = new RTCPeerConnection(rtcConfig);

        const local = stream || state.localStream;
        if (local) {
            local.getTracks().forEach(track => pc.addTrack(track, local));
        }

        pc.ontrack = (event) => {
            setState(prev => ({ ...prev, remoteStream: event.streams[0] }));
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit('iceCandidate', {
                    candidate: event.candidate,
                    targetUserId: state.isCaller ? state.targetUser?.userId : state.callerUser?.userId,
                    callerId: user?.id,
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            // Optional: debug
            // console.log('ICE state:', pc.iceConnectionState)
        };

        peerConnection.current = pc;
        return pc;
    }, [rtcConfig, socket, state.localStream, state.isCaller, state.targetUser, state.callerUser, user?.id]);

    const startVideoCall = useCallback(async (targetUserId: string) => {
        const targetUser = onlineUsers?.find(u => u.userId === targetUserId);
        if (!targetUser || !socket || !user) return;

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            setState(prev => ({ ...prev, showCameraPermission: true }));
            return;
        }

        const localStream = await initializeLocalStream();
        if (!localStream) {
            alert('Không thể truy cập camera/microphone');
            return;
        }

        setState(prev => ({
            ...prev,
            isInCall: true,
            isCaller: true,
            isReceiver: false,
            targetUser,
            callerUser: null,
            callStatus: 'calling',
        }));

        const pc = createPeerConnection(localStream);
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('videoCall', { callerId: user.id, receiverId: targetUserId, offer });
        } catch (error) {
            console.error('Failed to create offer:', error);
            endCall();
        }
    }, [onlineUsers, socket, user, requestCameraPermission, initializeLocalStream, createPeerConnection]);

    const acceptCall = useCallback(async () => {
        if (!socket || !user) return;

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            setState(prev => ({ ...prev, showCameraPermission: true }));
            return;
        }

        const localStream = await initializeLocalStream();
        if (!localStream) {
            alert('Không thể truy cập camera/microphone');
            return;
        }

        setState(prev => ({ ...prev, isInCall: true, isReceiver: true }));

        const pc = createPeerConnection(localStream);
        try {
            if (!state.incomingOffer) {
                console.warn('No incoming offer to accept');
                return;
            }
            await pc.setRemoteDescription(new RTCSessionDescription(state.incomingOffer));
            await drainPendingCandidates();
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('callAccepted', { callerId: state.callerUser?.userId, receiverId: user.id, answer });
            setState(prev => ({ ...prev, callStatus: 'connected' }));
        } catch (error) {
            console.error('Failed to accept call:', error);
            endCall();
        }
    }, [socket, user, requestCameraPermission, initializeLocalStream, createPeerConnection, state.callerUser?.userId, state.incomingOffer, drainPendingCandidates]);

    const rejectCall = useCallback(() => {
        if (socket && user && state.callerUser) {
            socket.emit('callRejected', { callerId: state.callerUser.userId, receiverId: user.id });
        }
        setState(prev => ({
            ...prev,
            isInCall: false,
            isCaller: false,
            isReceiver: false,
            callStatus: 'idle',
            targetUser: null,
            callerUser: null,
            incomingOffer: null,
        }));
    }, [socket, user, state.callerUser]);

    const endCall = useCallback(() => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        if (state.localStream) state.localStream.getTracks().forEach(track => track.stop());
        if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
        pendingRemoteCandidatesRef.current = [];

        setState(prev => ({
            ...prev,
            isInCall: false,
            isCaller: false,
            isReceiver: false,
            localStream: null,
            remoteStream: null,
            callStatus: 'idle',
            callDuration: 0,
            targetUser: null,
            callerUser: null,
            incomingOffer: null,
        }));
    }, [state.localStream]);

    const toggleLocalVideo = useCallback(() => {
        if (state.localStream) {
            const videoTrack = state.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setState(prev => ({ ...prev, isLocalVideoEnabled: videoTrack.enabled }));
            }
        }
    }, [state.localStream]);

    const toggleLocalAudio = useCallback(() => {
        if (state.localStream) {
            const audioTrack = state.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setState(prev => ({ ...prev, isLocalAudioEnabled: audioTrack.enabled }));
            }
        }
    }, [state.localStream]);

    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = (data: any) => {
            const caller = onlineUsers?.find(u => u.userId === data.callerId);
            if (!caller) return;
            setState(prev => ({
                ...prev,
                isInCall: true,
                isCaller: false,
                isReceiver: true,
                callerUser: caller,
                targetUser: null,
                callStatus: 'ringing',
                incomingOffer: data.offer || null,
            }));
        };

        const handleCallAccepted = async (data: any) => {
            try {
                if (peerConnection.current && data?.answer) {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                    await drainPendingCandidates();
                }
                setState(prev => ({ ...prev, callStatus: 'connected' }));
            } catch (e) {
                console.error('Failed to set remote description (answer):', e);
            }
        };

        const handleCallRejected = () => { endCall(); };
        const handleCallEnded = () => { endCall(); };

        const handleIceCandidate = async (data: any) => {
            const cand = data?.candidate as RTCIceCandidateInit | undefined;
            if (!cand) return;
            if (peerConnection.current && peerConnection.current.remoteDescription) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(cand));
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            } else {
                // queue until remoteDescription is set
                pendingRemoteCandidatesRef.current.push(cand);
            }
        };

        socket.on('incomingVideoCall', handleIncomingCall);
        socket.on('callAccepted', handleCallAccepted);
        socket.on('callRejected', handleCallRejected);
        socket.on('callEnded', handleCallEnded);
        socket.on('iceCandidate', handleIceCandidate);

        return () => {
            socket.off('incomingVideoCall', handleIncomingCall);
            socket.off('callAccepted', handleCallAccepted);
            socket.off('callRejected', handleCallRejected);
            socket.off('callEnded', handleCallEnded);
            socket.off('iceCandidate', handleIceCandidate);
        };
    }, [socket, onlineUsers, endCall, drainPendingCandidates]);

    useEffect(() => {
        if (state.callStatus === 'connected' && !callTimerRef.current) {
            callTimerRef.current = setInterval(() => {
                setState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
            }, 1000);
        }
        return () => {
            if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
        };
    }, [state.callStatus]);

    const contextValue: VideoCallContextType = {
        ...state,
        startVideoCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleLocalVideo,
        toggleLocalAudio,
        requestCameraPermission,
        grantCameraPermission,
        denyCameraPermission,
    };

    return (
        <VideoCallContext.Provider value={contextValue}>
            {children}
        </VideoCallContext.Provider>
    );
};

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) throw new Error('useVideoCall must be used within a VideoCallProvider');
    return context;
}; 