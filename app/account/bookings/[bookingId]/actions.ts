"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function cancelBookingAndRedirect(bookingId: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  
  // Fetch booking to verify ownership and status
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, status, user_id")
    .eq("id", bookingId)
    .single()
  
  if (error || !booking) {
    throw new Error("Booking not found")
  }
  
  // Only guests can cancel their own bookings
  if (booking.user_id !== user.id) {
    throw new Error("Unauthorized")
  }
  
  if (!["pending", "confirmed"].includes(booking.status)) {
    throw new Error("Booking cannot be cancelled")
  }
  
  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
  
  if (updateError) {
    throw new Error("Failed to cancel booking")
  }
  
  revalidatePath("/account/bookings")
  revalidatePath(`/account/bookings/${bookingId}`)
  redirect("/account/bookings")
}