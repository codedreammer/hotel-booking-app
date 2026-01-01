    import Link from "next/link"
    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import { redirect } from "next/navigation"
    import DeleteRoomButton from "./DeleteRoomButton"

    type Hotel = {
    id: string
    name: string
    city: string
    rating: number | null
    created_at: string
    }

    export default async function OwnerDashboardPage() {
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

    // 1️⃣ Get logged-in user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // 2️⃣ Fetch profile & role
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single()

    if (profileError || profile?.role !== "owner") {
        return (
        <p className="p-6 text-red-500">
            Access denied. Owner account required.
        </p>
        )
    }

    // 3️⃣ Fetch hotels owned by this user
    const { data, error } = await supabase
        .from("hotels")
        .select(`
        id,
        name,
        city,
        rating,
        created_at
        `)
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Owner hotels error:", error.message)
        return <p className="p-6">Failed to load owner hotels.</p>
    }

    const hotels = data as Hotel[]

    const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
        id,
        check_in,
        check_out,
        total_price,
        status,
        rooms (
            rooms_type,
            hotels (
            name
            )
        )
        `)
        .eq("rooms.hotels.owner_id", user.id)
        .order("check_in", { ascending: false })

    if (bookingsError) {
        console.error("Owner bookings error:", bookingsError.message)
    }

    const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select(`
        id,
        rooms_type,
        price_per_night,
        total_rooms,
        max_guests,
        hotel_id,
        hotels!inner (
            id,
            name,
            owner_id
        )
        `)
        .eq("hotels.owner_id", user.id)

    if (roomsError) {
        console.error("Rooms error:", roomsError.message)
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">
            Owner Dashboard
        </h1>

        <p className="text-gray-400">
            Welcome, {profile.full_name}
        </p>

        {hotels.length === 0 ? (
            <p className="mt-6 text-gray-500">
            You haven’t added any hotels yet.
            </p>
        ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
                <div
                key={hotel.id}
                className="border rounded-lg p-4 bg-black/40"
                >
                <h2 className="font-semibold text-lg">
                    {hotel.name}
                </h2>

                <p className="text-sm text-gray-400">
                    {hotel.city}
                </p>

                <p className="mt-2 text-sm">
                    ⭐ Rating: {hotel.rating ?? "N/A"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Added on{" "}
                    {new Date(hotel.created_at).toLocaleDateString()}
                </p>

                <Link
                    href={`/owner/dashboard/hotels/${hotel.id}/rooms/new`}
                    className="inline-block mt-4 text-sm px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                    ➕ Add Room
                </Link>
                </div>
            ))}
            </div>
        )}

        <h2 className="text-xl font-semibold mt-10">
            Recent Bookings
        </h2>

        {!bookings || bookings.length === 0 ? (
            <p className="text-gray-500 mt-4">
            No bookings for your hotels yet.
            </p>
        ) : (
            <div className="mt-4 space-y-4">
            {bookings.map((booking) => {
                const room = booking.rooms?.[0]
                const hotel = room?.hotels?.[0]

                return (
                <div
                    key={booking.id}
                    className="border rounded-lg p-4 bg-black/40"
                >
                    <p className="font-semibold">
                    {hotel?.name}
                    </p>

                    <p className="text-sm text-gray-400">
                    Room: {room?.rooms_type}
                    </p>

                    <p className="text-sm">
                    {booking.check_in} → {booking.check_out}
                    </p>

                    <p className="mt-1">₹{booking.total_price}</p>

                    <span
                    className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                        booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    >
                    {booking.status}
                    </span>
                </div>
                )
            })}
            </div>
        )}

        <h2 className="text-xl font-semibold mt-10">
            Your Rooms
        </h2>

        {!rooms || rooms.length === 0 ? (
            <p className="text-gray-500 mt-4">
            No rooms added yet.
            </p>
        ) : (
            <div className="mt-4 space-y-4">
            {rooms.map((room) => {
                const hotel = room.hotels?.[0]

                return (
                <div
                    key={room.id}
                    className="border rounded-lg p-4 bg-black/40"
                >
                    <p className="font-semibold">
                    {hotel?.name}
                    </p>

                    <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">
                        Room Type: {room.rooms_type}
                        </p>
                        <p>₹{room.price_per_night} / night</p>
                        <p>Total Rooms: {room.total_rooms}</p>
                        <p>Max Guests: {room.max_guests}</p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={`/owner/dashboard/rooms/${room.id}`}
                            className="text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                        >
                            Edit
                        </Link>

                        <DeleteRoomButton roomId={room.id} />
                    </div>
                    </div>
                </div>
                )
            })}
            </div>
        )}
        </div>
    )
    }
