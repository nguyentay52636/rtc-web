"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useUser } from '@clerk/nextjs';

interface AudioCallState {
    isInCall: boolean;
    isCaller: boolean;
    isReceiver: boolean;
    callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
    callDuration: number;
    targetUser: any | null;
    callerUser: any | null;
    incomingCall: any | null;
    showIncomingCall: boolean;
}

interface AudioCallContextType extends AudioCallState {
    startAudioCall: (targetUserId: string) => Promise<void>;
    acceptCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    setIncomingCall: (call: any) => void;
    setShowIncomingCall: (show: boolean) => void;
}

const AudioCallContext = createContext<AudioCallContextType | null>(null);

export const AudioCallProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket, onlineUsers } = useSocket();
    const { user } = useUser();

    const [state, setState] = useState<AudioCallState>({
        isInCall: false,
        isCaller: false,
        isReceiver: false,
        callStatus: 'idle',
        callDuration: 0,
        targetUser: null,
        callerUser: null,
        incomingCall: null,
        showIncomingCall: false,
    });

    const callTimerRef = useRef<NodeJS.Timeout | null>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    // Initialize ringtone audio
    useEffect(() => {
        ringtoneRef.current = new Audio('/sounds/despacito.mp3');
        ringtoneRef.current.loop = true;
        ringtoneRef.current.volume = 0.5;

        return () => {
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current = null;
            }
        };
    }, []);

    const startCallTimer = useCallback(() => {
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
        }

        callTimerRef.current = setInterval(() => {
            setState(prev => ({
                ...prev,
                callDuration: prev.callDuration + 1
            }));
        }, 1000);
    }, []);

    const stopCallTimer = useCallback(() => {
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
    }, []);

    const playRingtone = useCallback(() => {
        if (ringtoneRef.current) {
            ringtoneRef.current.play().catch(console.error);
        }
    }, []);

    const stopRingtone = useCallback(() => {
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
    }, []);

    const startAudioCall = useCallback(async (targetUserId: string) => {
        const targetUser = onlineUsers?.find(u => u.userId === targetUserId);
        if (!targetUser) {
            alert('Người dùng không online');
            return;
        }

        setState(prev => ({
            ...prev,
            isInCall: true,
            isCaller: true,
            isReceiver: false,
            callStatus: 'calling',
            callDuration: 0,
            targetUser,
            callerUser: null,
        }));

        // Emit call event to socket
        socket?.emit('audio-call', {
            targetUserId,
            callerInfo: {
                userId: user?.id,
                profile: {
                    fullName: user?.fullName,
                    imageUrl: user?.imageUrl,
                }
            }
        });
    }, [socket, user, onlineUsers]);

    const acceptCall = useCallback(async () => {
        if (!state.incomingCall) return;

        stopRingtone();
        setState(prev => ({
            ...prev,
            isInCall: true,
            isCaller: false,
            isReceiver: true,
            callStatus: 'connected',
            showIncomingCall: false,
            callerUser: prev.incomingCall.callerInfo,
        }));

        startCallTimer();

        // Emit accept call event
        socket?.emit('audio-call-accepted', {
            targetUserId: state.incomingCall.callerInfo.userId,
            receiverInfo: {
                userId: user?.id,
                profile: {
                    fullName: user?.fullName,
                    imageUrl: user?.imageUrl,
                }
            }
        });
    }, [state.incomingCall, socket, user, stopRingtone, startCallTimer]);

    const rejectCall = useCallback(() => {
        stopRingtone();

        if (state.incomingCall) {
            // Emit reject call event
            socket?.emit('audio-call-rejected', {
                targetUserId: state.incomingCall.callerInfo.userId,
            });
        }

        setState(prev => ({
            ...prev,
            isInCall: false,
            isCaller: false,
            isReceiver: false,
            callStatus: 'idle',
            callDuration: 0,
            targetUser: null,
            callerUser: null,
            incomingCall: null,
            showIncomingCall: false,
        }));
    }, [state.incomingCall, socket, stopRingtone]);

    const endCall = useCallback(() => {
        stopCallTimer();
        stopRingtone();

        // Emit end call event
        if (state.isInCall) {
            const targetUserId = state.isCaller ? state.targetUser?.userId : state.callerUser?.userId;
            if (targetUserId) {
                socket?.emit('audio-call-ended', {
                    targetUserId,
                    callDuration: state.callDuration,
                });
            }
        }

        setState(prev => ({
            ...prev,
            isInCall: false,
            isCaller: false,
            isReceiver: false,
            callStatus: 'ended',
            callDuration: 0,
            targetUser: null,
            callerUser: null,
            incomingCall: null,
            showIncomingCall: false,
        }));

        // Show call ended notification after a short delay
        setTimeout(() => {
            setState(prev => ({ ...prev, callStatus: 'idle' }));
        }, 2000);
    }, [state.isInCall, state.isCaller, state.targetUser, state.callerUser, state.callDuration, socket, stopCallTimer, stopRingtone]);

    const setIncomingCall = useCallback((call: any) => {
        setState(prev => ({
            ...prev,
            incomingCall: call,
            showIncomingCall: true,
            callStatus: 'ringing',
        }));
        playRingtone();
    }, [playRingtone]);

    const setShowIncomingCall = useCallback((show: boolean) => {
        setState(prev => ({ ...prev, showIncomingCall: show }));
        if (!show) {
            stopRingtone();
        }
    }, [stopRingtone]);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleIncomingAudioCall = (data: any) => {
            console.log('Incoming audio call:', data);
            setIncomingCall(data);
        };

        const handleAudioCallAccepted = (data: any) => {
            console.log('Audio call accepted:', data);
            setState(prev => ({
                ...prev,
                isInCall: true,
                isCaller: true,
                isReceiver: false,
                callStatus: 'connected',
                callerUser: data.receiverInfo,
            }));
            startCallTimer();
        };

        const handleAudioCallRejected = () => {
            console.log('Audio call rejected');
            setState(prev => ({
                ...prev,
                isInCall: false,
                isCaller: true,
                isReceiver: false,
                callStatus: 'idle',
                targetUser: null,
            }));
        };

        const handleAudioCallEnded = (data: any) => {
            console.log('Audio call ended:', data);
            stopCallTimer();
            setState(prev => ({
                ...prev,
                isInCall: false,
                isCaller: false,
                isReceiver: false,
                callStatus: 'ended',
                callDuration: data.callDuration || 0,
            }));

            // Show call ended notification
            setTimeout(() => {
                setState(prev => ({ ...prev, callStatus: 'idle' }));
            }, 2000);
        };

        socket.on('incoming-audio-call', handleIncomingAudioCall);
        socket.on('audio-call-accepted', handleAudioCallAccepted);
        socket.on('audio-call-rejected', handleAudioCallRejected);
        socket.on('audio-call-ended', handleAudioCallEnded);

        return () => {
            socket.off('incoming-audio-call', handleIncomingAudioCall);
            socket.off('audio-call-accepted', handleAudioCallAccepted);
            socket.off('audio-call-rejected', handleAudioCallRejected);
            socket.off('audio-call-ended', handleAudioCallEnded);
        };
    }, [socket, setIncomingCall, startCallTimer, stopCallTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCallTimer();
            stopRingtone();
        };
    }, [stopCallTimer, stopRingtone]);

    const value: AudioCallContextType = {
        ...state,
        startAudioCall,
        acceptCall,
        rejectCall,
        endCall,
        setIncomingCall,
        setShowIncomingCall,
    };

    return (
        <AudioCallContext.Provider value={value}>
            {children}
        </AudioCallContext.Provider>
    );
};

export const useAudioCall = () => {
    const context = useContext(AudioCallContext);
    if (!context) {
        throw new Error('useAudioCall must be used within an AudioCallProvider');
    }
    return context;
}; 