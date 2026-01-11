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
            onClick={onSelect}
            className={`border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer transition-all duration-200 ${selected
                    ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
        >
            <div>
                <h3 className={`text-lg font-bold mb-1 ${selected ? "text-blue-900" : "text-gray-900"}`}>
                    {room.rooms_type}
                </h3>
                <div className={`text-sm ${selected ? "text-blue-700" : "text-gray-500"} space-y-1`}>
                    <p className="flex items-center gap-2">
                        <span>👥 Max guests: <b>{room.max_guests}</b></span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span>🚪 Available rooms: <b>{room.total_rooms}</b></span>
                    </p>
                </div>
            </div>

            <div className="text-right mt-4 md:mt-0 flex flex-col items-end">
                <p className={`text-2xl font-bold ${selected ? "text-blue-900" : "text-gray-900"}`}>
                    ₹{room.price_per_night}
                    <span className={`text-sm font-normal ${selected ? "text-blue-600" : "text-gray-500"}`}>/night</span>
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    className={`mt-3 px-6 py-2 rounded-xl text-sm font-semibold transition ${selected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {selected ? "Selected" : "Select Room"}
                </button>
            </div>
        </div>
    )
}
