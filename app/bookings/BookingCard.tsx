    "use client"

    import { cancelBooking } from "./action"
    import { useTransition } from "react"

    type Booking = {
    id: string
    check_in: string
    check_out: string
    total_price: number
    status: string
    rooms: {
        rooms_type: string
        room_images: { image_url: string }[]
    }[]
    }

    export default function BookingCard({ booking }: { booking: Booking }) {
    const [isPending, startTransition] = useTransition()

    const room = booking.rooms[0]

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkInDate = new Date(booking.check_in)
    checkInDate.setHours(0, 0, 0, 0)

    const canCancel =
        booking.status === "confirmed" &&
        checkInDate.getTime() > today.getTime()

    return (
        <div className="border rounded-lg p-4 flex gap-4">
        <img
            src={room?.room_images?.[0]?.image_url ?? "/placeholder.jpg"}
            className="w-32 h-24 object-cover rounded"
        />

        <div className="flex-1">
            <h2 className="font-semibold text-lg">
            {room?.rooms_type}
            </h2>

            <p className="text-sm text-gray-600">
            {booking.check_in} → {booking.check_out}
            </p>

            <p className="mt-1">₹{booking.total_price}</p>

            <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                booking.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
            >
            {booking.status}
            </span>

            {canCancel && (
            <button
                disabled={isPending}
                onClick={() =>
                startTransition(async () => {
                    await cancelBooking(booking.id)
                    window.location.reload()
                })
                }
                className="mt-3 px-4 py-2 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
            >
                {isPending ? "Cancelling..." : "Cancel Booking"}
            </button>
            )}
        </div>
        </div>
    )
    }
