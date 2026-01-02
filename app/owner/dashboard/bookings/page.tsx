    import { getOwnerBookings } from "./actions";
    import BookingActions from "./BookingAction";

    export default async function OwnerBookingsPage() {
    const bookings = await getOwnerBookings();

    return (
        <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Bookings</h1>

        {bookings.length === 0 && (
            <p className="text-gray-400">No bookings yet.</p>
        )}

        <div className="space-y-4">
            {bookings.map((booking) => (
            <div
                key={booking.id}
                className="border rounded-lg p-4 bg-black"
            >
                <div className="flex justify-between">
                <div>
                    <h3 className="font-semibold">
                    {(booking.room as any).hotel.name} — {(booking.room as any).room_type}
                    </h3>
                    <p className="text-sm text-gray-400">
                    {booking.check_in} → {booking.check_out}
                    </p>
                    <p>
                    Status: <b>{booking.status}</b>
                    </p>

                </div>

                <BookingActions booking={booking} />
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }
