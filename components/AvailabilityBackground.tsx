"use client";

import Image from "next/image";

export default function AvailabilityBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <Image
                src="https://i.pinimg.com/1200x/b2/bb/3d/b2bb3dc3f318322da2dbe0c32df9be6e.jpg"
                alt="Background"
                fill
                className="object-cover opacity-10 dark:opacity-[0.05] grayscale-[0.5]"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white/60 to-white dark:from-gray-950/50 dark:via-gray-950/60 dark:to-gray-950" />
        </div>
    );
}
