import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import OnboardingChecklist from "@/components/OnboardingChecklist"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getOwnerData() {
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
  
  // Get basic stats
  const { data: hotels } = await supabase
    .from('hotels')
    .select('id')
    .eq('owner_id', user.id)
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status')
    .in('hotel_id', hotels?.map(h => h.id) || [])
  
  return {
    user,
    profile,
    hotelCount: hotels?.length || 0,
    totalBookings: bookings?.length || 0,
    activeBookings: bookings?.filter(b => b.status === 'confirmed').length || 0
  }
}

export default async function OwnerDashboard() {
  const { user, profile, hotelCount, totalBookings, activeBookings } = await getOwnerData()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Owner Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                View as Guest
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Onboarding Checklist */}
        {profile?.role === 'owner' && <OnboardingChecklist />}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">H</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Hotels
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {hotelCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">B</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Bookings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {activeBookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Bookings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalBookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State for No Hotels */}
        {hotelCount === 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-8 text-center mb-6">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hotels yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first hotel property to begin managing bookings and rooms.
            </p>
            <Link
              href="/owner/dashboard/hotels/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Hotel
            </Link>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/owner/dashboard/analytics" className="group">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                  Analytics
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  View performance metrics and insights
                </p>
              </div>
            </div>
          </Link>

          <Link href="/owner/dashboard/hotels" className="group">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 dark:text-green-400 text-xl">🏨</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-green-600">
                  Hotels
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Manage your hotel properties
                </p>
              </div>
            </div>
          </Link>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow opacity-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🛏️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Rooms
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Select a hotel to manage rooms
              </p>
            </div>
          </div>

          <Link href="/owner/dashboard/bookings" className="group">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 dark:text-orange-400 text-xl">📅</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-orange-600">
                  Bookings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  View and manage reservations
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}