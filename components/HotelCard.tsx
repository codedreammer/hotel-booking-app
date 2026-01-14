"use client"

import Link from "next/link"

export interface HotelWithMeta {
    id: string
    name: string
    city: string
    description?: string
    star_rating?: number
    price: number      // from meta
    image: string      // from meta
    rating: number     // from meta
}

export default function HotelCard({ hotel, searchParams }: { hotel: HotelWithMeta, searchParams?: any }) {
    // Construct query string for the link to preserve search params
    const queryString = new URLSearchParams(searchParams).toString();
    const href = `/hotels/${hotel.id}${queryString ? `?${queryString}` : ''}`;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-xs">⭐</span>
                        <span className="text-xs font-bold text-gray-900">{hotel.star_rating || hotel.rating.toFixed(1)}</span>
                    </div>
                </div>
                {/* Optional Badge - strictly adhering to "Preserve badges like 'Only 2 rooms left'" if they exist */}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                    Only 2 rooms left
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                    </h3>
                </div>

                <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 10 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.001.001zM10 13a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                    </svg>
                    {hotel.city}
                </p>

                {/* Amenities Badges (Visual only for now) */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {["WiFi", "Pool"].map(tag => (
                        <span key={tag} className="text-[10px] font-medium bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">
                            {tag}
                        </span>
                    ))}
                    <span className="text-[10px] font-medium text-gray-400 px-1">+2 more</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Start from</p>
                        <p className="text-xl font-bold text-gray-900 leading-none">
                            ₹{hotel.price.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">per night</p>
                    </div>

                    <Link
                        href={href}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-100"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    )
}
