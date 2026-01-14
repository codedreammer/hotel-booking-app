"use client"

import { useState } from "react"

export default function FilterSidebar() {
    const [priceRange, setPriceRange] = useState([1000, 20000])
    const [minRating, setMinRating] = useState(3)
    const [isOpen, setIsOpen] = useState(false)

    const amenities = [
        "WiFi",
        "Pool",
        "Gym",
        "Spa",
        "Restaurant",
        "Parking",
        "Pet Friendly",
        "Room Service"
    ]

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile Toggle */}
            <div className="lg:hidden p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    Filters
                </h3>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Content (Collapsible on mobile) */}
            <div className={`p-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg hidden lg:block">Filters</h3>
                    <button className="text-sm text-blue-600 font-semibold hover:text-blue-800">
                        Clear all
                    </button>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Price Range</h4>
                    <div className="px-2">
                        <input
                            type="range"
                            min="500"
                            max="50000"
                            step="500"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Minimum Rating</h4>
                    <div className="flex flex-col gap-3">
                        {[5, 4, 3].map((star) => (
                            <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={minRating === star}
                                    onChange={() => setMinRating(star)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${i < star ? "fill-current" : "text-gray-200"}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">& up</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Amenities</h4>
                    <div className="space-y-3">
                        {amenities.map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
