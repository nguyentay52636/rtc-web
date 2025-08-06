import React from 'react'

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-[1920px] w-full mx-auto px-4 xl:p-20 px-4 py-4">
            {children}
        </div>
    )
}
