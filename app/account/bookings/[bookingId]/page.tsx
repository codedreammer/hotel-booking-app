import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { cancelBookingAndRedirect } from "./actions"

async function getBookingDetails(bookingId: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role !== 'guest') redirect("/owner/dashboard")
  
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      check_in,
      check_out,
      status,
      created_at,
      rooms (
        name,
        capacity,
        hotels (
          name,
          city
        )
      )
    `)
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()
    
  if (error || !booking) {
    return null
  }
    
  return booking
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
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const statuses = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'checked_in', label: 'Checked In' },
    { key: 'checked_out', label: 'Checked Out' }
  ]
  
  const currentIndex = statuses.findIndex(s => s.key === currentStatus)
  const isCancelled = currentStatus === 'cancelled'
  
  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <span className="text-red-700 dark:text-red-300 font-medium">Cancelled</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex
        const isCurrent = status.key === currentStatus
        
        return (
          <div key={status.key} className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              isActive 
                ? isCurrent 
                  ? 'bg-blue-500' 
                  : 'bg-green-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}></div>
            <span className={`${
              isActive 
                ? 'text-gray-900 dark:text-white font-medium' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {status.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CancelBookingForm({ bookingId }: { bookingId: string }) {
  return (
    <form action={cancelBookingAndRedirect.bind(null, bookingId)}>
      <button
        type="submit"
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium"
        onClick={(e) => {
          if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            e.preventDefault()
          }
        }}
      >
        Cancel Booking
      </button>
    </form>
  )
}

export default async function BookingDetailsPage({ 
  params 
}: { 
  params: { bookingId: string } 
}) {
  const booking = await getBookingDetails(params.bookingId)
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <header className="bg-white dark:bg-zinc-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/account/bookings" className="text-xl font-semibold text-gray-900 dark:text-white">
                ← Back to My Bookings
              </Link>
            </div>
          </div>
        </header>
        
        <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The booking you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link
              href="/account/bookings"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to My Bookings
            </Link>
          </div>
        </main>
      </div>
    )
  }
  
  const canCancel = ['pending', 'confirmed'].includes(booking.status)
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/account/bookings" className="text-xl font-semibold text-gray-900 dark:text-white">
              ← Back to My Bookings
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {booking.rooms?.hotels?.name || 'Hotel'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {booking.rooms?.hotels?.city || 'Location'}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Check-in</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(booking.check_in).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Check-out</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(booking.check_out).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking ID</h3>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {booking.id}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Room Type</h3>
                    <p className="text-gray-900 dark:text-white">
                      {booking.rooms?.name || 'Standard Room'}
                    </p>
                  </div>
                  {booking.rooms?.capacity && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</h3>
                      <p className="text-gray-900 dark:text-white">
                        {booking.rooms.capacity} guests
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Booked On</h3>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Booking Status
                </h2>
                <StatusTimeline currentStatus={booking.status} />
              </div>
            </div>

            {/* Actions */}
            {canCancel && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Need to cancel?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can cancel this booking if your plans change.
                    </p>
                  </div>
                  <CancelBookingForm bookingId={booking.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}