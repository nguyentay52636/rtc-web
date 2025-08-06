"use client"

import React from 'react'
import Container from './Container'
import VideoPage from '@/app/page'
import { useRouter } from 'next/navigation'
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '../ui/button'
import { Video, MessageSquare } from 'lucide-react'

export default function NavBar() {
    const router = useRouter();
    const { userId } = useAuth();
    return (
        <div className='sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-200 z-50 shadow-sm'>
            <Container>
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                        router.push('/');
                    }}>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white text-xl font-bold">
                            VideoChat
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                            <MessageSquare className="w-4 h-4" />
                        </Button>
                        <UserButton />
                        {!userId && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50">
                                    Sign in
                                </Button>
                                <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                                    Sign up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}
