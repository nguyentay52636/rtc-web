import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'

export default function RingtoneTest() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)

    const initializeAudio = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/sounds/despacito.mp3')
            audioRef.current.loop = true
            audioRef.current.volume = volume

            audioRef.current.addEventListener('play', () => setIsPlaying(true))
            audioRef.current.addEventListener('pause', () => setIsPlaying(false))
            audioRef.current.addEventListener('ended', () => setIsPlaying(false))
        }
    }

    const playRingtone = () => {
        initializeAudio()
        if (audioRef.current) {
            audioRef.current.play().catch(console.error)
        }
    }

    const pauseRingtone = () => {
        if (audioRef.current) {
            audioRef.current.pause()
        }
    }

    const stopRingtone = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Ringtone Test - Despacito</h2>

            <div className="space-y-4">
                {/* Status */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                        <strong>Status:</strong> {isPlaying ? 'Playing' : 'Stopped'}
                    </p>
                    <p className="text-sm">
                        <strong>Volume:</strong> {Math.round(volume * 100)}%
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <Button
                        onClick={playRingtone}
                        disabled={isPlaying}
                        className="bg-green-500 hover:bg-green-600"
                    >
                        <Play className="w-4 h-4 mr-1" />
                        Play
                    </Button>

                    <Button
                        onClick={pauseRingtone}
                        disabled={!isPlaying}
                        variant="outline"
                    >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                    </Button>

                    <Button
                        onClick={stopRingtone}
                        variant="destructive"
                    >
                        <VolumeX className="w-4 h-4 mr-1" />
                        Stop
                    </Button>
                </div>

                {/* Volume Control */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Volume</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Thông tin</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• File: <code>/sounds/despacito.mp3</code></li>
                        <li>• Loop: Enabled</li>
                        <li>• Default volume: 50%</li>
                        <li>• Sử dụng cho cuộc gọi đến</li>
                    </ul>
                </div>

                {/* Test Instructions */}
                <div className="p-3 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">Hướng dẫn test</h3>
                    <ol className="text-sm text-yellow-700 space-y-1">
                        <li>1. Click "Play" để phát chuông</li>
                        <li>2. Điều chỉnh volume bằng thanh trượt</li>
                        <li>3. Click "Pause" để tạm dừng</li>
                        <li>4. Click "Stop" để dừng hoàn toàn</li>
                        <li>5. Chuông sẽ tự động phát khi có cuộc gọi đến</li>
                    </ol>
                </div>
            </div>
        </div>
    )
} 