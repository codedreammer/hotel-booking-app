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

export async function getHotelBookings(hotelId: string) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Verify hotel ownership
  const { data: hotel } = await supabase
    .from("hotels")
    .select("id")
    .eq("id", hotelId)
    .eq("owner_id", user.id)
    .single();

  if (!hotel) throw new Error("Hotel not found or unauthorized");

  // Get rooms for this hotel
  const { data: rooms, error: roomError } = await supabase
    .from("rooms")
    .select("id, rooms_type")
    .eq("hotel_id", hotelId);

  if (roomError) throw roomError;
  if (!rooms || rooms.length === 0) return [];

  const roomMap = new Map(rooms.map(r => [r.id, r.rooms_type]));
  const roomIds = rooms.map(r => r.id);

  // Get bookings for these rooms with guest info
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      id,
      room_id,
      check_in,
      check_out,
      status,
      total_price,
      profiles!bookings_user_id_fkey (
        full_name
      )
    `)
    .in("room_id", roomIds)
    .order("created_at", { ascending: false });

  if (bookingError) throw bookingError;

  return bookings.map(b => ({
    id: b.id,
    check_in: b.check_in,
    check_out: b.check_out,
    status: b.status,
    total_price: b.total_price,
    room: {
      room_type: roomMap.get(b.room_id),
    },
    profiles: Array.isArray(b.profiles) ? b.profiles[0] : b.profiles,
  }));
}