    "use server";

    import { cookies } from "next/headers";
    import { createServerClient } from "@supabase/ssr";

    async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {},
        },
        }
    );
    }

    export async function getAvailabilityData(days = 14) {
    const supabase = await getSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 1️⃣ Hotels
    const { data: hotels } = await supabase
        .from("hotels")
        .select("id, name")
        .eq("owner_id", user.id);

    if (!hotels || hotels.length === 0) return [];

    const hotelIds = hotels.map(h => h.id);

    // 2️⃣ Rooms
    const { data: rooms } = await supabase
        .from("rooms")
        .select("id, rooms_type, total_rooms, hotel_id")
        .in("hotel_id", hotelIds);

    if (!rooms || rooms.length === 0) return [];

    const roomIds = rooms.map(r => r.id);

    // 3️⃣ Bookings (future only)
    const today = new Date().toISOString().split("T")[0];

    const { data: bookings } = await supabase
        .from("bookings")
        .select("room_id, check_in, check_out, status")
        .in("room_id", roomIds)
        .neq("status", "cancelled")
        .gte("check_out", today);

    return { hotels, rooms, bookings };
    }
