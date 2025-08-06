import React from 'react'
import Container from './Container'
import VideoPage from '@/app/page'
import { useRouter } from 'next/navigation'

export default function NavBar() {
    const router = useRouter();
    return (
        <div className='sticky top-0 border border-red-500'>
            <Container>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                    router.push('/');
                }}>
                    <VideoPage />
                    <div className="">
                        video chat
                    </div>
                </div>
            </Container>
        </div>
    )
}
