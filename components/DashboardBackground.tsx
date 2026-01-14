'use client'

import { useState, useEffect } from 'react'

export default function DashboardBackground() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div
            className={`absolute inset-0 z-0 transition-opacity duration-800 ease-in-out pointer-events-none overflow-hidden ${isLoaded ? "opacity-100" : "opacity-100"
                }`}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/50 via-[#F8FAFC]/70 to-[#F8FAFC]/90 z-10" />
            <img
                src="https://i.pinimg.com/1200x/40/ac/fd/40acfde8a7d5cfb78296e5dec1537bbb.jpg"
                alt="Background"
                className="w-full h-full object-cover"
            />
        </div>
    )
}
