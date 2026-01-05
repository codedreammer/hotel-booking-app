import Link from 'next/link'
import { getHotelBookings } from './actions'
import BookingActions from '../../../bookings/BookingAction'

interface Props {
  params: Promise<{ hotelId: string }>
}

export default async function HotelBookingsPage({ params }: Props) {
  const { hotelId } = await params

  if (!hotelId) {
    return (
      <div className="p-6">
        <p className="text-red-400">Error: Hotel ID is missing</p>
      </div>
    )
  }

  const bookings = await getHotelBookings(hotelId)

  return (
    <div className="p-6">
      <Link
        href={`/owner/dashboard/hotels/${hotelId}`}
        className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
      >
        ← Back to Hotel Overview
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-400">No bookings for this hotel yet.</p>
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
                  {booking.profiles?.full_name || 'Guest'} — {booking.room.room_type}
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
  )
}