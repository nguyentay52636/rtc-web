"use client"

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SocketTest() {
    const { socket, isSocketConnected, onlineUsers, isLoading } = useSocket();
    const { user, isLoaded } = useUser();
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on('test', (message) => {
                console.log('Received test message:', message);
                setTestMessage(message);
            });

            return () => {
                socket.off('test');
            };
        }
    }, [socket]);

    const sendTestMessage = () => {
        if (socket) {
            socket.emit('test', 'Hello from client!');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
            <h3 className="font-bold mb-2">Socket Status</h3>
            <div className="space-y-2 text-sm">
                <div>
                    <span className="font-medium">Clerk Loaded: </span>
                    <span className={isLoaded ? 'text-green-600' : 'text-red-600'}>
                        {isLoaded ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <span className="font-medium">User: </span>
                    {user ? user.id : 'Not logged in'}
                </div>
                <div>
                    <span className="font-medium">Loading: </span>
                    <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                        {isLoading ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Socket Connected: </span>
                    <span className={isSocketConnected ? 'text-green-600' : 'text-red-600'}>
                        {isSocketConnected ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Online Users: </span>
                    {onlineUsers ? onlineUsers.length : 0}
                </div>
                {testMessage && (
                    <div>
                        <span className="font-medium">Test Message: </span>
                        {testMessage}
                    </div>
                )}
                <button
                    onClick={sendTestMessage}
                    disabled={!isSocketConnected}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Send Test
                </button>
            </div>
        </div>
    );
} 