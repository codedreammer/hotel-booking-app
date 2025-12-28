    "use client"

    import { useState, useTransition } from "react"
    import { updateRoom } from "../../actions"

    export default function RoomEditForm({ room }: { room: any }) {
    const [price, setPrice] = useState(room.price_per_night)
    const [totalRooms, setTotalRooms] = useState(room.total_rooms)
    const [isPending, startTransition] = useTransition()

    function handleSubmit() {
        startTransition(async () => {
        await updateRoom(room.id, {
            price_per_night: price,
            total_rooms: totalRooms,
        })
        })
    }

    return (
        <div className="space-y-4">
        <div>
            <label className="block text-sm">Price per night</label>
            <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full p-2 border rounded bg-black"
            />
        </div>

        <div>
            <label className="block text-sm">Total rooms</label>
            <input
            type="number"
            value={totalRooms}
            onChange={(e) => setTotalRooms(Number(e.target.value))}
            className="w-full p-2 border rounded bg-black"
            />
        </div>

        <div className="text-sm text-gray-400">
            Max guests: {room.max_guests} (cannot be changed)
        </div>

        <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-green-600 rounded disabled:opacity-50"
        >
            {isPending ? "Saving..." : "Save Changes"}
        </button>
        </div>
    )
    }
