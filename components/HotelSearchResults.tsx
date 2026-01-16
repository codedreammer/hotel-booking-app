"use client"

import { useMemo, useState } from "react"
import FilterSidebar from "./FilterSidebar"
import HotelCard, { HotelWithMeta } from "./HotelCard"

interface HotelSearchResultsProps {
    initialHotels: HotelWithMeta[];
    city: string;
    checkIn: string;
    checkOut: string;
    guests: string;
}

export default function HotelSearchResults({
    initialHotels,
    city,
    checkIn,
    checkOut,
    guests
}: HotelSearchResultsProps) {
    const [priceRange, setPriceRange] = useState<[number, number]>([500, 50000])
    const [minRating, setMinRating] = useState<number | null>(null)
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

    const filteredHotels = useMemo(() => {
        return initialHotels.filter(hotel => {
            // Price Filter (Match against derived price)
            if (hotel.price > priceRange[1]) return false;

            // Rating Filter (Show hotels with rating >= selected value)
            const rating = hotel.star_rating || hotel.rating;
            if (minRating && rating < minRating) return false;

            // Amenities Filter (Only show hotels that include ALL selected amenities)
            if (selectedAmenities.length > 0) {
                const hasAllAmenities = selectedAmenities.every(amenity =>
                    hotel.amenities.includes(amenity)
                );
                if (!hasAllAmenities) return false;
            }

            return true;
        });
    }, [initialHotels, priceRange, minRating, selectedAmenities]);

    const handleClearAll = () => {
        setPriceRange([500, 50000]);
        setMinRating(null);
        setSelectedAmenities([]);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar (Filters) */}
            <aside className="w-full lg:w-72 flex-shrink-0">
                <div className="lg:sticky lg:top-28">
                    <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        minRating={minRating}
                        setMinRating={setMinRating}
                        selectedAmenities={selectedAmenities}
                        setSelectedAmenities={setSelectedAmenities}
                        onClearAll={handleClearAll}
                    />
                </div>
            </aside>

            {/* Right Content */}
            <div className="flex-1">
                {/* Header & Count */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {city ? `${filteredHotels.length} hotels in ${city}` : "Explore Hotels"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {checkIn && checkOut
                            ? `${new Date(checkIn).toLocaleDateString()} — ${new Date(checkOut).toLocaleDateString()} • ${guests} Guests`
                            : "Find your perfect stay"
                        }
                    </p>
                </div>

                {/* Grid */}
                {filteredHotels.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="text-gray-300 text-6xl mb-4">🏨</div>
                        <h3 className="text-lg font-semibold text-gray-900">No hotels found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredHotels.map(hotel => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                searchParams={{ city, check_in: checkIn, check_out: checkOut, guests }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
