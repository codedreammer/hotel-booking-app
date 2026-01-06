import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"

async function getProfile() {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()
    
  return profile
}

export default async function AccountDashboard() {
  const profile = await getProfile()
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
              Hotel Booking Platform
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Search Hotels
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <span>{profile?.full_name || 'Account'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    Profile
                  </Link>
                  <Link href="/account/bookings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    My Bookings
                  </Link>
                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hello, {profile?.full_name || 'Guest'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and bookings
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/account/profile" className="group">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                    Profile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and edit your personal information
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/account/bookings" className="group">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 text-xl">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-green-600">
                    My Bookings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View your hotel reservations
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}