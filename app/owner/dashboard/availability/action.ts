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
    try {
        const supabase = await getSupabase();

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log("User:", user?.id, "Error:", userError);
        
        if (!user) {
            console.log("No user found");
            return { hotels: [], rooms: [], bookings: [], error: "No user" };
        }

        // 1️⃣ Hotels
        const { data: hotels, error: hotelError } = await supabase
            .from("hotels")
            .select("id, name")
            .eq("owner_id", user.id);

        console.log("Hotels query result:", { hotels, error: hotelError });

        if (!hotels || hotels.length === 0) {
            console.log("No hotels found for user");
            return { hotels: [], rooms: [], bookings: [], error: "No hotels" };
        }

        const hotelIds = hotels.map(h => h.id);
        console.log("Hotel IDs:", hotelIds);

        // 2️⃣ Rooms
        const { data: rooms, error: roomError } = await supabase
            .from("rooms")
            .select("id, rooms_type, total_rooms, hotel_id")
            .in("hotel_id", hotelIds)
            .eq("is_active", true);

        console.log("Rooms query result:", { rooms, error: roomError });

        if (!rooms || rooms.length === 0) {
            console.log("No rooms found for hotels");
            return { hotels, rooms: [], bookings: [], error: "No rooms" };
        }
        
        const roomIds = rooms.map(r => r.id);
        console.log("Room IDs:", roomIds);

        // 3️⃣ Bookings (future only)
        const today = new Date().toISOString().split("T")[0];
        console.log("Today:", today);

        const { data: bookings, error: bookingError } = await supabase
            .from("bookings")
            .select("room_id, check_in, check_out, status")
            .in("room_id", roomIds)
            .neq("status", "cancelled")
            .gte("check_out", today);

        console.log("Bookings query result:", { bookings, error: bookingError });

        const result = { hotels, rooms, bookings: bookings || [] };
        console.log("Final result:", result);
        
        return result;
    } catch (error) {
        console.error("Error in getAvailabilityData:", error);
        return { hotels: [], rooms: [], bookings: [], error: (error as Error).message };
    }
}

export async function getBookingsForDate(roomId: string, date: string) {
  const supabase = await getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("bookings")
    .select("id, check_in, check_out, status")
    .eq("room_id", roomId)
    .lte("check_in", date)
    .gt("check_out", date)
    .neq("status", "cancelled");

  if (error) throw error;

  return data;
}
