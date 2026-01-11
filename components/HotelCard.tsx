"use client"

import Link from "next/link"

type Hotel = {
    id: string
    name: string
    city: string
    price_per_night: number
    image_url: string
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
    return (
        <Link href={`/hotels/${hotel.id}`} className="block">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">

                {/* Hotel Image */}
                <div className="relative">
                    <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20">
                        Only 2 rooms left
                    </div>
                </div>

                {/* Hotel Info */}
                <div className="p-4">
                    <h2 className="text-lg font-semibold">{hotel.name}</h2>
                    <p className="text-gray-500">{hotel.city}</p>
                    <p className="mt-2 font-bold">
                        ₹ {hotel.price_per_night} / night
                    </p>
                </div>

            </div>
        </Link>
    )
}
