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
        setAll: () => { },
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
      check_in,
      check_out,
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
        rooms_type,
        price_per_night
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
    case 'confirmed': return 'bg-green-50 text-green-700 border border-green-200'
    case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200'
    case 'checked_in': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'checked_out': return 'bg-gray-50 text-gray-700 border border-gray-200'
    default: return 'bg-gray-50 text-gray-700 border border-gray-200'
  }
}

export default async function OwnerBookings() {
  const bookings = await getOwnerBookings()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/owner/dashboard"
                className="text-gray-500 hover:text-gray-900 font-medium transition"
              >
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Bookings Management
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium transition shadow-sm">
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500">
              Bookings will appear here once guests start making reservations.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {bookings.map((booking: any) => {
                const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;
                const hotel = Array.isArray(booking.hotels) ? booking.hotels[0] : booking.hotels;
                const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;

                return (
                  <li key={booking.id} className="px-6 py-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {profile?.full_name?.[0] || 'G'}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {profile?.full_name || 'Guest'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {profile?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Hotel</span>
                            <span>{hotel?.name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Room</span>
                            <span>{room?.rooms_type || room?.type}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Dates</span>
                            <span>{new Date(booking.check_in).toLocaleDateString()} — {new Date(booking.check_out).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-blue-600 font-bold">₹{booking.total_price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6">
                        {booking.status === 'confirmed' && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                            Check In
                          </button>
                        )}
                        {booking.status === 'checked_in' && (
                          <button className="text-green-600 hover:text-green-800 text-sm font-bold hover:bg-green-50 px-3 py-2 rounded-lg transition">
                            Check Out
                          </button>
                        )}

                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}