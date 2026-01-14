'use client'

import { useState, useEffect } from 'react'

interface AnimatedBackgroundProps {
    src: string;
    overlayOpacity?: string;
}

export default function AnimatedBackground({ src, overlayOpacity = "bg-[#cbd5e1]/60" }: AnimatedBackgroundProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none overflow-hidden ${isLoaded ? "opacity-100" : "opacity-0"
                }`}
        >
            <div className={`absolute inset-0 bg-gradient-to-b from-[#94a3b8]/50 via-[#94a3b8]/70 to-[#94a3b8]/90 z-10`} />
            <img
                src={src}
                alt="Background"
                className="w-full h-full object-cover"
            />
        </div>
    )
}
