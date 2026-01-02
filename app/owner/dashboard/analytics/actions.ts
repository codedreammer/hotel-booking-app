    "use server";

    import { cookies } from "next/headers";
    import { createServerClient } from "@supabase/ssr";

    async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
        }
    );
    }

    export async function getOwnerAnalytics(days = 30) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + days);
    const todayStr = today.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    // 1) Hotels
    const { data: hotels } = await supabase
        .from("hotels")
        .select("id")
        .eq("owner_id", user.id);
    if (!hotels?.length) return null;

    const hotelIds = hotels.map(h => h.id);

    // 2) Rooms
    const { data: rooms } = await supabase
        .from("rooms")
        .select("id, total_rooms, rooms_type, hotel_id")
        .in("hotel_id", hotelIds);
    if (!rooms?.length) return null;

    const roomIds = rooms.map(r => r.id);

    // 3) Bookings (relevant window)
    const { data: bookings } = await supabase
        .from("bookings")
        .select("room_id, check_in, check_out, status")
        .in("room_id", roomIds)
        .neq("status", "cancelled")
        .lt("check_in", endStr)
        .gt("check_out", todayStr);

    // Compute room-nights
    const daysBetween = (a: string, b: string) =>
        Math.max(0, Math.ceil((+new Date(b) - +new Date(a)) / 86400000));

    let bookedRoomNights = 0;
    bookings?.forEach(b => {
        const from = b.check_in < todayStr ? todayStr : b.check_in;
        const to = b.check_out > endStr ? endStr : b.check_out;
        bookedRoomNights += daysBetween(from, to);
    });

    const totalRoomNights =
        rooms.reduce((sum, r) => sum + r.total_rooms, 0) * days;

    const occupancy =
        totalRoomNights > 0
        ? Math.round((bookedRoomNights / totalRoomNights) * 100)
        : 0;

    const upcoming = bookings?.filter(b => b.check_out >= todayStr).length ?? 0;
    const past = bookings?.filter(b => b.check_out < todayStr).length ?? 0;

    return {
        occupancy,
        upcoming,
        past,
        rooms: rooms.length,
    };
    }

    export async function getOccupancyTrend(days = 7) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date();

    // 1️⃣ Hotels
    const { data: hotels } = await supabase
        .from("hotels")
        .select("id")
        .eq("owner_id", user.id);

    if (!hotels?.length) return [];

    // 2️⃣ Rooms
    const { data: rooms } = await supabase
        .from("rooms")
        .select("id, total_rooms")
        .in("hotel_id", hotels.map(h => h.id));

    if (!rooms?.length) return [];

    const roomIds = rooms.map(r => r.id);
    const totalRooms = rooms.reduce((s, r) => s + r.total_rooms, 0);

    // 3️⃣ Bookings
    const { data: bookings } = await supabase
        .from("bookings")
        .select("room_id, check_in, check_out")
        .in("room_id", roomIds)
        .neq("status", "cancelled");

    // 4️⃣ Build trend
    const trend = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.toISOString().split("T")[0];

        const booked = bookings?.filter(
        b => b.check_in <= day && b.check_out > day
        ).length ?? 0;

        const occupancy = totalRooms
        ? Math.round((booked / totalRooms) * 100)
        : 0;

        trend.push({ day, occupancy });
    }

    return trend;
    }
