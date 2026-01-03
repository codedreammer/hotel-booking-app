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

export async function cancelBooking(bookingId: string) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Fetch booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, status, user_id")
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return { error: "Booking not found" };
  }

  if (booking.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  if (booking.status === "checked_in" || booking.status === "checked_out") {
    return { error: "Booking cannot be cancelled at this stage" };
  }

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  return { success: true };
}