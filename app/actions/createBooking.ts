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

export async function createBooking(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const supabase = await getSupabase();

  /* 1️⃣ Auth (guest must be logged in) */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login to continue" };
  }

  /* 2️⃣ Fetch room (single source of truth) */
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, total_rooms, price_per_night")
    .eq("id", roomId)
    .eq("is_active", true)
    .single();

  if (roomError || !room) {
    return { error: "Room not found" };
  }

  /* 3️⃣ Count blocking bookings */
  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId)
    .in("status", ["confirmed", "checked_in"])
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (countError) {
    return { error: "Failed to check availability" };
  }

  if ((count ?? 0) >= room.total_rooms) {
    return { error: "Room is fully booked for selected dates" };
  }

  /* 4️⃣ Create booking (PENDING) */
  const { error: insertError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
      status: "pending",
      price: room.price_per_night,
    });

  if (insertError) {
    return { error: "Failed to create booking" };
  }

  return { success: true };
}