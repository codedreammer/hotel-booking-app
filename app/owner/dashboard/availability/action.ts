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
                setAll: () => {},
            },
        }
    );
}

export async function getAvailabilityData(days = 14) {
    try {
        const supabase = await getSupabase();

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!user) {
            return { hotels: [], rooms: [], bookings: [], error: "No user" };
        }

        // 1️⃣ Hotels
        const { data: hotels, error: hotelError } = await supabase
            .from("hotels")
            .select("id, name")
            .eq("owner_id", user.id);

        if (!hotels || hotels.length === 0) {
            return { hotels: [], rooms: [], bookings: [], error: "No hotels" };
        }

        const hotelIds = hotels.map(h => h.id);

        // 2️⃣ Rooms
        const { data: rooms, error: roomError } = await supabase
            .from("rooms")
            .select("id, rooms_type, total_rooms, hotel_id")
            .in("hotel_id", hotelIds)
            .eq("is_active", true);

        if (!rooms || rooms.length === 0) {
            return { hotels, rooms: [], bookings: [], error: "No rooms" };
        }
        
        const roomIds = rooms.map(r => r.id);

        const { data: bookings, error: bookingError } = await supabase
            .from("bookings")
            .select("id, room_id, check_in, check_out, status")
            .in("room_id", roomIds);

        // Build occupancy map
        const occupancyByRoom: Record<string, Record<string, number>> = {};
        
        for (const room of rooms) {
            const roomBookings = bookings?.filter(b => 
                b.room_id === room.id && 
                b.status !== "cancelled"
            ) || [];
            
            const occupancy: Record<string, number> = {};
            
            for (const b of roomBookings) {
                const days = getDatesBetween(b.check_in, b.check_out);
                for (const day of days) {
                    occupancy[day] = (occupancy[day] ?? 0) + 1;
                }
            }
            
            occupancyByRoom[room.id] = occupancy;
        }

        return { hotels, rooms, bookings: bookings || [], occupancyByRoom };
    } catch (error) {
        return { hotels: [], rooms: [], bookings: [], error: (error as Error).message };
    }
}

    export async function getBookingsForDate(roomId: string, date: string) {
    const supabase = await getSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("bookings")
        .select("id, room_id, check_in, check_out, status")
        .eq("room_id", roomId)
        .lte("check_in", date)
        .gt("check_out", date)
        .neq("status", "cancelled");

    if (error) throw error;

    return data;
    }
