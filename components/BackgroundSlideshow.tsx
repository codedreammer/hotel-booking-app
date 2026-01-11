"use client"

import { useEffect, useState } from "react"

const IMAGES = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-6e5a51335022?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=3525&auto=format&fit=crop",
]

export default function BackgroundSlideshow() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 min-h-screen -z-50 overflow-hidden pointer-events-none">
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10" />

                    <img
                        src={src}
                        alt="Hotel Background"
                        className="w-full h-full object-cover animate-pan"
                    />
                </div>
            ))}
            <style jsx global>{`
        @keyframes pan {
          0% { transform: scale(1.1); }
          100% { transform: scale(1.0); }
        }
        .animate-pan {
          animation: pan 10s ease-out infinite alternate;
        }
      `}</style>
        </div>
    )
}
