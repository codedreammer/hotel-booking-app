    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import BookingCard from "./BookingCard"

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

    const {
        data: { user },
    } = await supabase.auth.getUser()

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
        return <p className="p-6">You have no bookings yet.</p>
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
