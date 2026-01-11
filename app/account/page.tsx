import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import Header from "@/components/Header"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

  if (!user) {
    // Should handle redirect or loading state, but standard handling is middleware or null check
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header user={user} />

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user?.full_name || 'Guest'} 👋
          </h1>
          <p className="text-gray-500">
            Manage your profile and bookings
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/account/profile" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <span className="text-blue-600 text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Profile
                  </h3>
                  <p className="text-gray-500 mt-1">
                    View and edit your personal information
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/account/bookings" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-50 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <span className="text-green-600 text-3xl">📅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    My Bookings
                  </h3>
                  <p className="text-gray-500 mt-1">
                    View and manage your hotel reservations
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