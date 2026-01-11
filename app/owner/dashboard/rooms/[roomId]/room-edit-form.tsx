"use client"

import { useState, useTransition } from "react"
import { updateRoom } from "../../actions"
import { useRouter } from "next/navigation"

export default function RoomEditForm({ room }: { room: any }) {
    const [price, setPrice] = useState(room.price_per_night)
    const [totalRooms, setTotalRooms] = useState(room.total_rooms)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleSubmit() {
        startTransition(async () => {
            await updateRoom(room.id, {
                price_per_night: price,
                total_rooms: totalRooms,
            })
            router.refresh()
            alert("Room updated successfully")
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per night</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total rooms</label>
                <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
                Max guests: <span className="font-bold text-gray-900">{room.max_guests}</span> (cannot be changed)
            </div>

            <button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition"
            >
                {isPending ? "Saving..." : "Save Changes"}
            </button>
        </div>
    )
}
