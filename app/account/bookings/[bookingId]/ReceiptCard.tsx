interface Booking {
  id: string
  user_id: string
  status: string
  check_in: string
  check_out: string
  total_price?: number
  rooms?: {
    id?: string
    rooms_type?: string
    hotels?: {
      id?: string
      name?: string
      city?: string
      owner_id?: string
    }
  }
  profiles?: {
    full_name?: string
  }
}

interface ReceiptCardProps {
  booking: Booking
  isGuest: boolean
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
    checked_in: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800",
    checked_out: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800"
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

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function ReceiptCard({ booking, isGuest }: ReceiptCardProps) {
  const nights = calculateNights(booking.check_in, booking.check_out)
  const hotelName = booking.rooms?.hotels?.name || 'Hotel'
  const city = booking.rooms?.hotels?.city || ''

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 print-white-bg">
      {/* Header */}
      <div className="text-center border-b border-gray-200 dark:border-zinc-700 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 print-black">
          Booking Receipt
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 print-black">
          Booking ID: {booking.id}
        </p>
        <div className="mt-4">
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Hotel Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-black">
            Hotel Information
          </h2>
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 print-white-bg border border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 print-black">
              {hotelName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3 print-black">
              {city}
            </p>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(`${hotelName} ${city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View Location
            </a>
          </div>
        </div>

        {/* Guest Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-black">
            Guest Information
          </h2>
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 print-white-bg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 print-black">Guest Name</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {booking.profiles?.full_name || 'Guest'}
              </span>
            </div>
          </div>
        </div>

        {/* Room & Stay Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-black">
            Room & Stay Details
          </h2>
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3 print-white-bg border border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 print-black">Room Type</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {booking.rooms?.rooms_type || 'Standard Room'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 print-black">Check-in Date</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {new Date(booking.check_in).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 print-black">Check-out Date</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {new Date(booking.check_out).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 print-black">Number of Nights</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 print-black">Booking Status</span>
              <span className="font-medium text-gray-900 dark:text-white print-black">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        {booking.total_price && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 print-black">
              Payment Summary
            </h2>
            <div className="border-t border-b border-gray-200 dark:border-zinc-700 py-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-900 dark:text-white print-black">
                  Total Price
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white print-black">
                  ${booking.total_price}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}