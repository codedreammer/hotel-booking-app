    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import BookingCard from "./BookingCard"
    import Link from "next/link"

    type Booking = {
    id: string
    check_in: string
    check_out: string
    total_price: number
    status: string
    created_at: string
    rooms: {
        id: string
        rooms_type: string
        room_images: {
        image_url: string
        }[]
    }[]
    }

    async function getUser() {
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
      if (!user) return null
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      return { ...user, role: profile?.role }
    }

    export default async function BookingsPage() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get: (name) => cookieStore.get(name)?.value,
        },
        }
    )

    const user = await getUser()

    if (!user) {
        return <p className="p-6">Please log in to view your bookings.</p>
    }

    const { data, error } = await supabase
        .from("bookings")
        .select(`
        id,
        check_in,
        check_out,
        total_price,
        status,
        created_at,
        rooms (
            id,
            rooms_type,
            room_images (
            image_url
            )
        )
        `)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Bookings error:", error.message)
        return <p className="p-6">Failed to load bookings.</p>
    }

    const bookings = data as Booking[]

    if (bookings.length === 0) {
        return (
          <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You have no bookings yet.</p>
              {user?.role === 'guest' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-gray-700 mb-4">
                    Want to earn by hosting? List your hotel and start receiving bookings.
                  </p>
                  <Link 
                    href="/become-owner"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Start Hosting
                  </Link>
                </div>
              )}
            </div>
          </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>

        {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
        ))}
        </div>
    )
    }
