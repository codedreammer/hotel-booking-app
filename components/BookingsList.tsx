import Link from "next/link"
import CancelBookingButton from "@/app/account/bookings/CancelBookingButton"

interface Booking {
  id: string
  status: string
  check_in: string
  check_out: string
  total_price?: number
  rooms?: {
    rooms_type?: string
    hotels?: {
      name?: string
      city?: string
    }
  }
}

interface BookingsListProps {
  bookings: Booking[]
  showBackButton?: boolean
  backHref?: string
  backText?: string
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
    checked_in: "bg-green-50 text-green-700 border border-green-200",
    checked_out: "bg-gray-50 text-gray-700 border border-gray-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200"
  }

  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled"
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const canCancel = ['pending', 'confirmed'].includes(booking.status)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {booking.rooms?.hotels?.name || 'Hotel'}
          </h3>
          <p className="text-gray-600 font-medium mb-1">
            {booking.rooms?.rooms_type || 'Room'}
          </p>
          {booking.rooms?.hotels?.city && (
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {booking.rooms.hotels.city}
            </p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Check In</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(booking.check_in).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <div className="text-gray-300 mx-3">→</div>
          <div className="flex items-center text-gray-600">
            <div>
              <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold text-right">Check Out</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(booking.check_out).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        {booking.total_price && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Total Price</span>
            <p className="text-lg font-bold text-gray-900">
              ₹{booking.total_price}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {canCancel && (
          <CancelBookingButton bookingId={booking.id} />
        )}
        <Link
          href={`/account/bookings/${booking.id}`}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          View Booking
        </Link>
      </div>
    </div>
  )
}

export default function BookingsList({ bookings, showBackButton = true, backHref = "/account", backText = "Back to Account Dashboard" }: BookingsListProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {showBackButton && (
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link
                href={backHref}
                className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-500">
            View and manage your hotel reservations
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't made any reservations. Plan your next trip now!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Find a Hotel
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}