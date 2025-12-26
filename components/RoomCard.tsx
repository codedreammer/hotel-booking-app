    "use client"

    type Room = {
    id: string
    rooms_type: string
    price_per_night: number
    max_guests: number
    total_rooms: number
    }

    export default function RoomCard({
    room,
    selected,
    onSelect,
    }: {
    room: Room
    selected: boolean
    onSelect: () => void
    }) {
    return (
        <div
        className={`border rounded-lg p-4 flex justify-between items-center ${
            selected ? "border-green-500 bg-green-50" : "border-gray-700"
        }`}
        >
        <div>
            <h3 className="text-lg font-semibold">{room.rooms_type}</h3>
            <p>Max guests: {room.max_guests}</p>
            <p>Available rooms: {room.total_rooms}</p>
        </div>

        <div className="text-right">
            <p className="text-xl font-bold">₹{room.price_per_night} / night</p>
            <button
            onClick={onSelect}
            className={`mt-2 px-4 py-2 rounded ${
                selected
                ? "bg-green-600 text-white"
                : "bg-black text-white"
            }`}
            >
            {selected ? "Selected" : "Select Room"}
            </button>
        </div>
        </div>
    )
    }
