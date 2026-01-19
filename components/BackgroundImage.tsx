"use client";

import { useState, useEffect } from "react";

export default function BackgroundImage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            <img
                src="https://i.pinimg.com/1200x/50/aa/5b/50aa5b6fd6e61f8e5ddb07910efd5267.jpg"
                alt="Background"
                className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"
                    }`}
            />
        </div>
    );
}
