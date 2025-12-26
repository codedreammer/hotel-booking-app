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
        <div className="mt-8 border rounded-lg p-5 bg-black">
        <h3 className="text-xl font-semibold mb-4">
            Booking Details
        </h3>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm mb-1">Check-in</label>
            <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border"
            />
            </div>

            <div>
            <label className="block text-sm mb-1">Check-out</label>
            <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border"
            />
            </div>
        </div>

        <div className="mt-4 text-sm text-gray-300">
            <p>Nights: {nights}</p>
            <p className="text-lg font-bold text-white">
            Total: ₹{totalPrice}
            </p>
        </div>

        <button
    disabled={nights === 0 || loading}
    onClick={async () => {
        setLoading(true)
        setError(null)

        const res = await createBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        totalPrice,
        })

        setLoading(false)

        if (res?.error) {
        setError(res.error)
        } else {
        alert("Booking confirmed 🎉")
        }
    }}
    className={`mt-4 w-full py-2 rounded ${
        nights === 0 || loading
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
    >
    {loading ? "Booking..." : "Confirm Booking"}
    </button>

        {error && (
    <p className="text-red-500 mt-2 text-sm">
        {error}
    </p>
    )}

        </div>
    )
    }
