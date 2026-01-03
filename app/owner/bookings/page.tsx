import Link from "next/link"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getOwnerBookings() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role !== 'owner') redirect('/')
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      check_in_date,
      check_out_date,
      total_price,
      status,
      created_at,
      hotels (
        id,
        name,
        city
      ),
      rooms (
        id,
        type,
        room_number
      ),
      profiles (
        id,
        full_name,
        email
      )
    `)
    .eq('hotels.owner_id', user.id)
    .order('created_at', { ascending: false })
  
  return bookings || []
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'checked_in': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'checked_out': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default async function OwnerBookings() {
  const bookings = await getOwnerBookings()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/owner/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ← Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bookings Management
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm dark:bg-zinc-700 dark:text-white">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Bookings will appear here once guests start making reservations.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <li key={booking.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.profiles?.full_name || 'Guest'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Hotel:</span> {booking.hotels?.name}
                        </div>
                        <div>
                          <span className="font-medium">Room:</span> {booking.rooms?.type} #{booking.rooms?.room_number}
                        </div>
                        <div>
                          <span className="font-medium">Dates:</span> {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> ${booking.total_price}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {booking.status === 'confirmed' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Check In
                        </button>
                      )}
                      {booking.status === 'checked_in' && (
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Check Out
                        </button>
                      )}
                      <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}