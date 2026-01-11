"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

interface SearchFormProps {
    initialCity?: string
    initialCheckIn?: string
    initialCheckOut?: string
    initialGuests?: number
    compact?: boolean
}

export default function SearchForm({
    initialCity = "",
    initialCheckIn = "",
    initialCheckOut = "",
    initialGuests = 2,
    compact = false
}: SearchFormProps) {
    const router = useRouter()
    const [city, setCity] = useState(initialCity)
    const [checkIn, setCheckIn] = useState(initialCheckIn)
    const [checkOut, setCheckOut] = useState(initialCheckOut)

    // Guest selection state
    const [adults, setAdults] = useState(initialGuests)
    const [children, setChildren] = useState(0)
    const [isGuestOpen, setIsGuestOpen] = useState(false)
    const guestRef = useRef<HTMLDivElement>(null)

    const totalGuests = adults + children

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
                setIsGuestOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!city) return

        const params = new URLSearchParams()
        params.set("city", city)
        if (checkIn) params.set("check_in", checkIn)
        if (checkOut) params.set("check_out", checkOut)
        params.set("guests", totalGuests.toString())

        router.push(`/hotels?${params.toString()}`)
    }

    // Styles based on compact mode (for headers) vs full mode (for hero)
    const containerClass = compact
        ? "bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-2 items-center"
        : "w-full max-w-5xl bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row items-center"

    const inputGroupClass = compact
        ? ""
        : "flex-1 w-full p-4 border-b md:border-b-0 md:border-r border-gray-100 relative"

    const dateGroupClass = compact
        ? ""
        : "w-full md:w-40 p-4 border-b md:border-b-0 md:border-r border-gray-100"

    const buttonClass = compact
        ? "bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
        : "w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"

    return (
        <form onSubmit={handleSearch} className={containerClass}>

            {/* City Input */}
            <div className={inputGroupClass}>
                {!compact && (
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                        Destination
                    </label>
                )}
                <div className="relative">
                    {!compact && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </div>
                    )}
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={compact ? "City" : "Where are you going?"}
                        className={`w-full outline-none text-gray-900 placeholder-gray-400 ${compact ? 'px-3 py-2 border border-gray-200 rounded-lg text-sm w-32 md:w-40' : 'pl-7 text-lg'}`}
                        required
                    />
                </div>
            </div>

            {/* Date Inputs */}
            <div className={dateGroupClass}>
                {!compact && (
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                        Check-in
                    </label>
                )}
                <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={`w-full outline-none text-gray-600 ${compact ? 'px-3 py-2 border border-gray-200 rounded-lg text-sm' : ''}`}
                    required
                />
            </div>

            <div className={dateGroupClass}>
                {!compact && (
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                        Check-out
                    </label>
                )}
                <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={`w-full outline-none text-gray-600 ${compact ? 'px-3 py-2 border border-gray-200 rounded-lg text-sm' : ''}`}
                    required
                />
            </div>

            {/* Guest Selector */}
            <div className={`${compact ? '' : 'w-full md:w-48 p-4 relative'}`} ref={guestRef}>
                {!compact && (
                    <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">
                        Guests
                    </label>
                )}
                <button
                    type="button"
                    onClick={() => setIsGuestOpen(!isGuestOpen)}
                    className={`text-left w-full outline-none text-gray-900 flex items-center justify-between ${compact ? 'px-3 py-2 border border-gray-200 rounded-lg text-sm w-24 bg-white' : 'text-lg'}`}
                >
                    <span>{totalGuests} Guest{totalGuests !== 1 ? 's' : ''}</span>
                    <svg className={`w-4 h-4 transition-transform ${isGuestOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isGuestOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                        {/* Adults */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-bold text-gray-900">Adults</p>
                                <p className="text-xs text-gray-500">Ages 13 or above</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAdults(Math.max(1, adults - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50"
                                    disabled={adults <= 1}
                                >
                                    -
                                </button>
                                <span className="w-4 text-center font-medium">{adults}</span>
                                <button
                                    type="button"
                                    onClick={() => setAdults(adults + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-900">Children</p>
                                <p className="text-xs text-gray-500">Ages 0-12</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setChildren(Math.max(0, children - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50"
                                    disabled={children <= 0}
                                >
                                    -
                                </button>
                                <span className="w-4 text-center font-medium">{children}</span>
                                <button
                                    type="button"
                                    onClick={() => setChildren(children + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Search Button */}
            <div className={compact ? "" : "p-2 w-full md:w-auto"}>
                <button
                    type="submit"
                    disabled={!city}
                    className={`${buttonClass} ${!city ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {!compact && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    )}
                    Search
                </button>
            </div>

        </form>
    )
}
