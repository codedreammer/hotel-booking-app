    "use client"

    import { useState } from "react"
    import RoomCard from "@/components/RoomCard"

    import BookingPanel from "@/components/BookingPanel"

    export default function HotelClient({ rooms }: { rooms: any[] }) {
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null)

    return (
        <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>

        <div className="space-y-4">
            {rooms.map((room) => (
            <RoomCard
                key={room.id}
                room={room}
                selected={selectedRoom?.id === room.id}
                onSelect={() => setSelectedRoom(room)}
            />
            ))}
            {selectedRoom && (
            <BookingPanel room={selectedRoom} />
            )}
        </div>

        {selectedRoom && (
            <p className="mt-6 text-green-600 font-medium">
            Selected Room: {selectedRoom.rooms_type}
            </p>
        )}
        </section>
    )
    }


