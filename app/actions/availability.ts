"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // 1️⃣ Get room capacity
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("total_rooms")
    .eq("id", roomId)
    .single();

  if (roomError || !room) throw new Error("Room not found");

  // 2️⃣ Count overlapping bookings
  const { count, error: bookingError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId)
    .neq("status", "cancelled")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (bookingError) throw bookingError;

  return {
    available: (count ?? 0) < room.total_rooms,
    remaining: room.total_rooms - (count ?? 0),
  };
}