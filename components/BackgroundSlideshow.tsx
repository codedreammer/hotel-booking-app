"use client"

import { useEffect, useState } from "react"

const IMAGES = [
    "https://images.unsplash.com/photo-1671711706325-f0dc59f16d40?q=80&w=1603&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1744807818642-60ad9660dc11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1724947053227-2335bf21d0ae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1629181486313-ac8cdfc7937c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

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
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-10" />

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
