import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import OnboardingChecklist from "@/components/OnboardingChecklist"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getTimeBasedGreeting } from "@/lib/utils/greeting"

async function getOwnerData() {
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
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') redirect('/')

  // Get hotels owned by this user
  const { data: hotels } = await supabase
    .from('hotels')
    .select('id, name')
    .eq('owner_id', user.id)

  const hotelIds = hotels?.map(h => h.id) || []

  // Get all rooms for these hotels
  const { data: rooms } = await supabase
    .from('rooms')
    .select('id, hotel_id, rooms_type, total_rooms, price_per_night')
    .in('hotel_id', hotelIds)
    .eq('is_active', true)

  const roomIds = rooms?.map(r => r.id) || []

  // Get all bookings for these rooms
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id, 
      status, 
      check_in, 
      check_out, 
      price,
      room_id,
      created_at
    `)
    .in('room_id', roomIds)
    .order('created_at', { ascending: false })

  // Calculate context data
  const today = new Date().toISOString().split('T')[0]

  const todayCheckIns = bookings?.filter(b =>
    b.check_in === today && ['confirmed', 'pending_checkin'].includes(b.status)
  ).length || 0

  const activeBookings = bookings?.filter(b =>
    ['confirmed', 'checked_in'].includes(b.status)
  ).length || 0

  const pendingBookings = bookings?.filter(b =>
    b.status === 'pending'
  ) || []

  const totalRevenue = bookings?.reduce((acc, b) => {
    if (['confirmed', 'checked_in', 'checked_out'].includes(b.status)) {
      return acc + (b.price || 0)
    }
    return acc
  }, 0) || 0

  // Calculate Occupancy
  const totalRooms = rooms?.reduce((acc, r) => acc + (r.total_rooms || 0), 0) || 0
  const occupiedToday = bookings?.filter(b =>
    b.check_in <= today && b.check_out >= today && ['confirmed', 'checked_in'].includes(b.status)
  ).length || 0
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedToday / totalRooms) * 100) : 0

  // Recent activity (mocking some types based on status changes if needed, but for now just recent bookings)
  const recentBookings = bookings?.slice(0, 5).map(b => {
    const room = rooms?.find(r => r.id === b.room_id)
    const hotel = hotels?.find(h => h.id === room?.hotel_id)
    return {
      ...b,
      hotel_name: hotel?.name,
      room_type: room?.rooms_type
    }
  }) || []

  return {
    user,
    profile,
    hotelCount: hotels?.length || 0,
    totalBookings: bookings?.length || 0,
    activeBookings,
    todayCheckIns,
    pendingBookings: pendingBookings.length,
    pendingBookingsList: pendingBookings,
    totalRevenue,
    occupancyRate,
    recentBookings,
    totalRooms,
    availableRooms: totalRooms - occupiedToday
  }
}

function getContextMessage(
  todayCheckIns: number,
  pendingBookings: number,
  activeBookings: number
): string {
  if (todayCheckIns > 0) {
    return `You have ${todayCheckIns} check-in${todayCheckIns === 1 ? '' : 's'} today. Let's get ready! 🏨`
  }

  if (pendingBookings > 0) {
    return `You have ${pendingBookings} new booking request${pendingBookings === 1 ? '' : 's'} waiting for approval. ⏳`
  }

  if (activeBookings > 0) {
    return `You have ${activeBookings} active guest${activeBookings === 1 ? '' : 's'} staying with you. 🏠`
  }

  return "No bookings today — you're all caught up 🎉"
}

export default async function OwnerDashboard() {
  const {
    profile, hotelCount, totalBookings, activeBookings,
    todayCheckIns, pendingBookings,
    totalRevenue, occupancyRate, recentBookings,
    totalRooms, availableRooms
  } = await getOwnerData()

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B]">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                StaySafe <span className="text-blue-600 dark:text-blue-500">Partner</span>
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                View as Guest
              </Link>
              <div className="h-4 w-[1px] bg-gray-300 dark:bg-zinc-700" />
              <div className="flex items-center space-x-4">
                <Link
                  href="/owner/dashboard/bookings"
                  className={`group relative p-2 rounded-xl transition-all ${pendingBookings > 0
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082A23.848 23.848 0 0112 17.25c-.967 0-1.91-.057-2.857-.168m5.714 0a3 3 0 11-5.714 0m5.714 0a24.255 24.255 0 003.857-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 10-12 0v.75a8.967 8.967 0 01-1.714 5.022 24.255 24.255 0 003.857 1.31" />
                  </svg>
                  {pendingBookings > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 animate-in fade-in zoom-in">
                      {pendingBookings > 99 ? '99+' : pendingBookings}
                    </span>
                  )}
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {getTimeBasedGreeting()}, {profile?.full_name?.split(' ')[0] || 'Partner'} 👋
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400 text-lg">
                {getContextMessage(todayCheckIns, pendingBookings, activeBookings)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Live: All properties active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: totalBookings, icon: '📅', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10', trend: '↑ 12% vs last month' },
            { label: 'Pending Requests', value: pendingBookings, icon: '⏳', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-500/10', trend: pendingBookings > 0 ? 'Waitlist active' : 'All cleared' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '₹', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '↑ 8% this week' },
            { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: '📈', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-500/10', trend: occupancyRate > 70 ? 'High performance' : 'Growing steady' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <span className="text-xl font-bold">{stat.icon}</span>
                </span>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</dd>
                <dt className="text-xs font-medium text-gray-400 dark:text-zinc-500 mt-1">{stat.trend}</dt>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Actions / Alerts */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3" />
                  Today&apos;s Actions
                </h3>
              </div>
              <div className="space-y-4">
                {pendingBookings > 0 ? (
                  <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-900 dark:text-amber-400">Booking Approvals Required</h4>
                      <p className="text-sm text-amber-800/80 dark:text-amber-500/70 mt-1">
                        You have {pendingBookings} pending reservation requests. Review them now to maintain your response rate.
                      </p>
                      <Link
                        href="/owner/dashboard/bookings"
                        className="inline-flex mt-3 text-sm font-bold text-amber-900 dark:text-amber-400 hover:underline underline-offset-4"
                      >
                        Review Requests →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-400">You&apos;re all caught up!</h4>
                      <p className="text-sm text-emerald-800/80 dark:text-emerald-500/70 mt-1">No urgent actions required today. Enjoy your day!</p>
                    </div>
                  </div>
                )}

                {availableRooms > 0 && availableRooms < 5 && (
                  <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 dark:text-red-400">Low Inventory Alert</h4>
                      <p className="text-sm text-red-800/80 dark:text-red-500/70 mt-1">
                        Only {availableRooms} rooms available for tonight. Consider increasing prices for the remaining inventory.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Bookings Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
                <Link href="/owner/dashboard/bookings" className="text-sm font-bold text-blue-600 dark:text-blue-500 hover:underline">
                  View All
                </Link>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 font-bold">
                        <th className="px-6 py-4">Guest</th>
                        <th className="px-6 py-4">Property / Room</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {recentBookings.length > 0 ? recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-zinc-200">
                            Guest #{booking.id.slice(0, 4)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-900 dark:text-zinc-200 font-medium">{booking.hotel_name}</p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{booking.room_type}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-zinc-400">
                            {new Date(booking.check_in).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -
                            {new Date(booking.check_out).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' :
                                booking.status === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20' :
                                  booking.status === 'checked_in' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20' :
                                    'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700'
                                }`}>
                                {booking.status.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href="/owner/dashboard/bookings"
                              className="p-2 inline-flex text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-500">
                            No recent bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Side Panel Area */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Hotel', href: '/owner/dashboard/hotels/new', icon: '🏨', color: 'bg-blue-600 text-white' },
                  { label: 'Add Room', href: '/owner/dashboard/hotels', icon: '🛌', color: 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white' },
                  { label: 'Pricing', href: '/owner/dashboard/hotels', icon: '🏷️', color: 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white' },
                  { label: 'Block Dates', href: '/owner/dashboard/availability', icon: '🚫', color: 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-sm ${action.color}`}
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-bold truncate w-full text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Property Health */}
            <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Inventory Health</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-zinc-400 font-medium">Availability Today</span>
                    <span className="text-gray-900 dark:text-zinc-200 font-bold">{availableRooms}/{totalRooms} rooms</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 70 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100/50 dark:border-zinc-700/50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Properties</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{hotelCount}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100/50 dark:border-zinc-700/50">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Active Now</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{activeBookings}</p>
                  </div>
                </div>

                {hotelCount === 0 && (
                  <div className="text-center py-4">
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium mb-3">No properties listed yet</p>
                    <Link href="/owner/dashboard/hotels/new" className="text-xs font-bold text-blue-600 dark:text-blue-500 hover:underline">
                      Add Your First Property →
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Activity Feed */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4 relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100 dark:bg-zinc-800" />
                {recentBookings.length > 0 ? recentBookings.slice(0, 3).map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-[13px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#09090B]" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 dark:text-zinc-200">
                        New Booking <span className="text-gray-500 dark:text-zinc-500 font-normal">for</span> {item.hotel_name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                        {new Date(item.created_at || '').toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-500 pl-4 py-2 italic font-medium">No recent activity found.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Onboarding Checklist (if applicable) */}
        {profile?.role === 'owner' && hotelCount === 0 && (
          <div className="mt-12">
            <OnboardingChecklist />
          </div>
        )}
      </main>
    </div>
  )
}