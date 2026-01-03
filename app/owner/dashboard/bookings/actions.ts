    "use server";

    import { cookies } from "next/headers";
    import { createServerClient } from "@supabase/ssr";

    function getDatesBetween(start: string, end: string) {
        const dates: string[] = [];
        let current = new Date(start);
        const last = new Date(end);

        while (current < last) {
            dates.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
        }

        return dates;
    }

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

    /* ================================
    FETCH OWNER BOOKINGS
    ================================ */
    export async function getOwnerBookings() {
    const supabase = await getSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    /* ===============================
        1️⃣ Get owner hotel IDs
    =============================== */
    const { data: hotels, error: hotelError } = await supabase
        .from("hotels")
        .select("id, name")
        .eq("owner_id", user.id);

    if (hotelError) throw hotelError;
    if (!hotels || hotels.length === 0) return [];

    const hotelMap = new Map(hotels.map(h => [h.id, h.name]));
    const hotelIds = hotels.map(h => h.id);

    /* ===============================
        2️⃣ Get rooms for those hotels
    =============================== */
    const { data: rooms, error: roomError } = await supabase
        .from("rooms")
        .select("id, rooms_type, hotel_id")
        .in("hotel_id", hotelIds);

    if (roomError) throw roomError;
    if (!rooms || rooms.length === 0) return [];

    const roomMap = new Map(
        rooms.map(r => [
        r.id,
        {
            room_type: r.rooms_type,
            hotel_name: hotelMap.get(r.hotel_id),
        },
        ])
    );

    const roomIds = rooms.map(r => r.id);

    /* ===============================
        3️⃣ Get bookings (NO JOINS)
    =============================== */
    const { data: bookings, error: bookingError } = await supabase
        .from("bookings")
        .select("id, room_id, check_in, check_out, status")
        .in("room_id", roomIds)
        .order("check_in", { ascending: true });

    if (bookingError) throw bookingError;

    /* ===============================
        4️⃣ Hydrate response shape
    =============================== */
    return bookings.map(b => {
        const room = roomMap.get(b.room_id);

        return {
        id: b.id,
        check_in: b.check_in,
        check_out: b.check_out,
        status: b.status,
        room: {
            room_type: room?.room_type,
            hotel: {
            name: room?.hotel_name,
            },
        },
        };
    });
    }

    /* ================================
    UPDATE BOOKING STATUS
    ================================ */
    export async function updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "cancelled" | "checked_in" | "checked_out"
    ) {
    const supabase = await getSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Ownership validation
    const { data: booking } = await supabase
        .from("bookings")
        .select(`
        id,
        check_in,
        check_out,
        status,
        room:rooms (
            id,
            total_rooms,
            hotel:hotels (
            owner_id
            )
        )
        `)
        .eq("id", bookingId)
        .single();

    if (!booking || (booking.room as any).hotel.owner_id !== user.id) {
        return { error: "Unauthorized" };
    }

    // Overbooking check for confirmations
    if (status === "confirmed") {
        const { data: overlappingBookings } = await supabase
            .from("bookings")
            .select("id, check_in, check_out")
            .eq("room_id", booking.room.id)
            .in("status", ["confirmed", "checked_in"])
            .neq("id", bookingId);

        const occupancy: Record<string, number> = {};

        for (const b of overlappingBookings ?? []) {
            const days = getDatesBetween(b.check_in, b.check_out);
            for (const day of days) {
                occupancy[day] = (occupancy[day] ?? 0) + 1;
            }
        }

        const bookingDays = getDatesBetween(
            booking.check_in,
            booking.check_out
        );

        for (const day of bookingDays) {
            const used = occupancy[day] ?? 0;

            if (used >= booking.room.total_rooms) {
                return {
                    error: `Cannot confirm — no availability on ${day}`,
                };
            }
        }
    }

    // Business rules
    if (status === "checked_in" && booking.status !== "confirmed") {
        return { error: "Only confirmed bookings can be checked in" };
    }

    if (status === "checked_out" && booking.status !== "checked_in") {
        return { error: "Guest must be checked in first" };
    }

    if (status === "cancelled") {
        if (booking.status === "checked_out") {
            return { error: "Cannot cancel a completed booking" };
        }
    }

    await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

    return { success: true };
    }
