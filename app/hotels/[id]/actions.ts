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
            setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
            );
            },
        },
        }
    );
    }

    export async function getHotelAvailability(
    hotelId: string,
    checkIn: string,
    checkOut: string
    ) {
    const supabase = await getSupabase();

    /* 1️⃣ Rooms for hotel */
    const { data: rooms, error: roomError } = await supabase
        .from("rooms")
        .select("id, rooms_type, price_per_night, total_rooms, max_guests")
        .eq("hotel_id", hotelId)
        .eq("is_active", true);

    if (roomError) throw roomError;
    if (!rooms || rooms.length === 0) return [];

    const roomIds = rooms.map((r) => r.id);

    /* 2️⃣ Blocking bookings (confirmed + checked_in) */
    const { data: bookings, error: bookingError } = await supabase
        .from("bookings")
        .select("room_id, check_in, check_out, status")
        .in("room_id", roomIds)
        .in("status", ["confirmed", "checked_in"])
        .lt("check_in", checkOut)
        .gt("check_out", checkIn);

    if (bookingError) throw bookingError;

    /* 3️⃣ Count bookings per room */
    const bookingCount: Record<string, number> = {};

    for (const b of bookings ?? []) {
        bookingCount[b.room_id] = (bookingCount[b.room_id] ?? 0) + 1;
    }

    /* 4️⃣ Hydrate availability */
    return rooms.map((room) => ({
        id: room.id,
        rooms_type: room.rooms_type,
        price_per_night: room.price_per_night,
        max_guests: room.max_guests,
        available_rooms:
        room.total_rooms - (bookingCount[room.id] ?? 0),
    }));
    }
