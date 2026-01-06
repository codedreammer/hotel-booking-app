import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cancelBooking } from "./actions"

async function getBookings() {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      check_in,
      check_out,
      total_price,
      status,
      created_at,
      rooms (
        id,
        name,
        rooms_type,
        hotels (
          name,
          city
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Bookings error:', error.message)
    return []
  }
    
  return bookings || []
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    checked_in: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    checked_out: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const canCancel = ['pending', 'confirmed'].includes(booking.status)
  
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {booking.rooms?.hotels?.name || 'Hotel'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {booking.rooms?.name || booking.rooms?.rooms_type || 'Room'}
          </p>
          {booking.rooms?.hotels?.city && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {booking.rooms.hotels.city}
            </p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(booking.check_in).toLocaleDateString()} → {new Date(booking.check_out).toLocaleDateString()}
        </p>
        {booking.total_price && (
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            ${booking.total_price}
          </p>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Link
          href={`/account/bookings/${booking.id}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
        >
          View Details
        </Link>
        {canCancel && (
          <form action={cancelBooking.bind(null, booking.id)} className="inline">
            <button
              type="submit"
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
              onClick={(e) => {
                if (!confirm('Are you sure you want to cancel this booking?')) {
                  e.preventDefault()
                }
              }}
            >
              Cancel Booking
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default async function BookingsPage() {
  const bookings = await getBookings()
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/account" className="text-xl font-semibold text-gray-900 dark:text-white">
              ← Back to Account
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your hotel reservations
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              You haven't booked any stays yet.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring hotels to plan your first trip ✨
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Hotels
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