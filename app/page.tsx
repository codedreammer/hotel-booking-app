import Link from "next/link"
import Image from "next/image"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import LogoutButton from "@/components/LogoutButton"
import OwnerCTAButton from "@/components/OwnerCTAButton"
import BackgroundSlideshow from "@/components/BackgroundSlideshow"
import SearchForm from "@/components/SearchForm"

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
    .select('role')
    .eq('id', user.id)
    .single()

  return { ...user, role: profile?.role }
}

export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen relative font-sans">
      <BackgroundSlideshow />

      {/* Header */}
      <header className="relative z-10 w-full py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">StaySafe</span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/hotels" className="text-gray-900 hover:text-blue-600 font-medium">Search Hotels</Link>

            {!user ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/account" className="text-gray-900 hover:text-blue-700 font-medium">
                  My Account
                </Link>
                {user.role === 'owner' ? (
                  <Link href="/owner/dashboard" className="text-blue-600 font-semibold hover:underline">
                    Owner Dashboard
                  </Link>
                ) : (
                  <OwnerCTAButton />
                )}
                <LogoutButton />
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 px-4">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect <span className="text-blue-600">Safe Stay</span>
          </h1>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto">
            Discover verified hotels with the best prices. Book with confidence knowing every property meets our safety standards.
          </p>
        </div>

        {/* Floating Search Bar */}
        <SearchForm />

        {/* Features / Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24 max-w-6xl mx-auto text-center">
          <div>
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Hotels</h3>
            <p className="text-gray-1000 leading-relaxed">Every property is verified for quality and safety standards.</p>
          </div>
          <div>
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
            <p className="text-gray-1000 leading-relaxed">Find a lower price? We'll match it and give you 10% off.</p>
          </div>
          <div>
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-1000 leading-relaxed">Round-the-clock customer support for any issues anytime.</p>
          </div>
        </div>

      </main>
    </div>
  )
}
