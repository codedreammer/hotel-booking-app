import Link from "next/link"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getOwnerHotels() {
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
  
  const { data: hotels } = await supabase
    .from('hotels')
    .select(`
      id,
      name,
      city,
      address,
      description,
      rooms (
        id,
        type,
        price_per_night
      )
    `)
    .eq('owner_id', user.id)
  
  return hotels || []
}

export default async function OwnerHotels() {
  const hotels = await getOwnerHotels()
  
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
                My Hotels
              </h1>
            </div>
            <Link href="/owner/dashboard/hotels/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add New Hotel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {hotels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hotels yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Get started by adding your first hotel property.
            </p>
            <Link href="/owner/dashboard/hotels/new" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Add Your First Hotel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {hotel.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        ✏️
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      📍 {hotel.city}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {hotel.address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {hotel.description}
                    </p>
                  </div>
                  
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rooms: {hotel.rooms?.length || 0}
                      </span>
                      <Link 
                        href={`/owner/hotels/${hotel.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Manage →
                      </Link>
                    </div>
                    
                    {hotel.rooms && hotel.rooms.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Price range: ${Math.min(...hotel.rooms.map(r => r.price_per_night))} - ${Math.max(...hotel.rooms.map(r => r.price_per_night))} / night
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Link 
                      href={`/hotels/${hotel.id}`}
                      className="flex-1 text-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      View as Guest
                    </Link>
                    <Link 
                      href={`/owner/hotels/${hotel.id}`}
                      className="flex-1 text-center py-2 px-3 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}