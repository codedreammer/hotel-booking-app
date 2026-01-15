'use client'

import { useEffect, useState } from 'react'

export default function BookingsBackground() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div
                className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Dark Gradient Overlay: Top to Bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-20" />

                <img
                    src="https://i.pinimg.com/1200x/39/a5/79/39a579d013ebc562bf92afd05efc5a0f.jpg"
                    alt="Luxury Interior"
                    className="w-full h-full object-cover"
                    style={{
                        animation: 'bookingsSlowZoom 30s ease-in-out infinite alternate',
                    }}
                />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bookingsSlowZoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.08); }
                }
            ` }} />
        </div>
    )
}
