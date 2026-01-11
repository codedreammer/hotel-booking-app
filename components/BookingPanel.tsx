"use client"

import { createBooking } from "@/app/actions/createBooking"
import { useState, useMemo } from "react"

type Room = {
    id: string
    rooms_type: string
    price_per_night: number
}

export default function BookingPanel({ room }: { room: Room }) {
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0
        const start = new Date(checkIn)
        const end = new Date(checkOut)
        const diff =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        return diff > 0 ? diff : 0
    }, [checkIn, checkOut])

    const totalPrice = nights * room.price_per_night

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    return (
        <div className="mt-8 border border-gray-100 rounded-2xl p-6 bg-white shadow-lg shadow-blue-50">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Booking Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-in</label>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-out</label>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    />
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Price per night</span>
                    <span>₹{room.price_per_night}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Nights</span>
                    <span>{nights}</span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                </div>
            </div>

            <button
                disabled={nights === 0 || loading}
                onClick={async () => {
                    setLoading(true)
                    setError(null)

                    const res = await createBooking(room.id, checkIn, checkOut)

                    setLoading(false)

                    if (res?.error) {
                        setError(res.error)
                    } else {
                        alert("Booking confirmed 🎉")
                    }
                }}
                className={`mt-6 w-full py-3.5 rounded-xl font-bold text-sm transition shadow-lg ${nights === 0 || loading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                    }`}
            >
                {loading ? "Processing..." : "Confirm Booking"}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    {error}
                </div>
            )}

        </div>
    )
}
