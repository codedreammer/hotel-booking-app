import Link from "next/link"
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getBookings } from "@/lib/bookings"
import { format } from "date-fns"

async function getUser() {
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
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return { ...user, ...profile }
}

export default async function AccountDashboard() {
  const user = await getUser()
  const bookings = await getBookings()

  if (!user) {
    return null;
  }

  // Calculate stats
  const totalBookings = bookings.length;
  const now = new Date();
  const upcomingBookingsList = bookings
    .filter(b => new Date(b.check_in) >= now && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());

  const upcomingCount = upcomingBookingsList.length;
  const totalSpent = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + Number(b.total_price || 0) : sum, 0);
  const nextBooking = upcomingBookingsList[0];

  const initials = user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-hidden">
      <AnimatedBackground src="https://i.pinimg.com/1200x/40/ac/fd/40acfde8a7d5cfb78296e5dec1537bbb.jpg" />
      <Header user={user} />

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-200">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Hello, {user?.full_name?.split(' ')[0] || 'Guest'} 👋
                </h1>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                  Verified User
                </span>
              </div>
              <p className="text-gray-500 font-medium">
                Manage your profile and bookings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/hotels"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
            >
              Search Hotels
            </Link>
            <Link
              href="/account/bookings"
              className="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
              View My Bookings
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { label: 'Total Bookings', value: totalBookings, icon: '📊', color: 'blue' },
            { label: 'Upcoming Stays', value: upcomingCount, icon: '✈️', color: 'indigo' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: '💰', color: 'emerald' },
            { label: 'Avg Rating', value: '—', icon: '⭐', color: 'amber' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-1">
                <span className="text-2xl mb-2">{stat.icon}</span>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Account Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Profile',
                  desc: 'View & edit personal information',
                  href: '/account/profile',
                  icon: '👤',
                  bgColor: 'bg-blue-50',
                  textColor: 'text-blue-600'
                },
                {
                  title: 'My Bookings',
                  desc: 'Manage your reservations',
                  href: '/account/bookings',
                  icon: '📅',
                  bgColor: 'bg-green-50',
                  textColor: 'text-green-600'
                },
                {
                  title: 'Security',
                  desc: 'Password and privacy settings',
                  href: '#',
                  icon: '🔒',
                  bgColor: 'bg-indigo-50',
                  textColor: 'text-indigo-600'
                },
                {
                  title: 'Support',
                  desc: 'Contact our help center',
                  href: '#',
                  icon: '🎧',
                  bgColor: 'bg-rose-50',
                  textColor: 'text-rose-600'
                }
              ].map((card) => (
                <Link key={card.title} href={card.href} className="group">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.bgColor} ${card.textColor} group-hover:scale-110 transition-transform`}>
                          {card.icon}
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Booking Preview */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Stay</h2>
            {nextBooking && nextBooking.rooms?.hotels ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Next Destination</p>
                    <h3 className="text-2xl font-bold mb-1 truncate">{nextBooking.rooms.hotels.name}</h3>
                    <p className="text-blue-50 opacity-90 flex items-center gap-1 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                      {nextBooking.rooms.hotels.city}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check In</p>
                      <p className="text-sm font-bold text-gray-900">{format(new Date(nextBooking.check_in), 'EEE, MMM d')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check Out</p>
                      <p className="text-sm font-bold text-gray-900">{format(new Date(nextBooking.check_out), 'EEE, MMM d')}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4 border-t border-gray-50 mb-6">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${nextBooking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {nextBooking.status}
                    </span>
                  </div>
                  <Link
                    href={`/account/bookings/${nextBooking.id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center h-[400px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">
                  🏨
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No upcoming stays</h3>
                <p className="text-gray-500 text-sm mb-8 max-w-[200px] mx-auto">
                  Looks like you haven&apos;t booked your next adventure yet.
                </p>
                <Link
                  href="/hotels"
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors active:scale-95"
                >
                  Find Hotels
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}