import React from 'react'

export default function Container({ children }: { children: React.ReactNode }) {

    return (
        <div className="bg-violet-800">
            <div className=" mx-8">
                {children}
            </div>
        </div>
    )
}
