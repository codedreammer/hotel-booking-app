import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getBookings() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      check_in,
      check_out,
      total_price,
      rooms (
        rooms_type,
        hotels (
          name,
          city
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Bookings error:', error.message)
    return []
  }

  // Flatten rooms array if Supabase returns it as array
  return (data || []).map((booking: any) => ({
    ...booking,
    rooms: Array.isArray(booking.rooms)
      ? booking.rooms[0]
      : booking.rooms,
    hotels: Array.isArray(booking.rooms?.[0]?.hotels) ? booking.rooms?.[0]?.hotels?.[0] : booking.rooms?.hotels
    // Wait, rooms.hotels usage in BookingsList is booking.rooms.hotels.name
    // If rooms is flattened to object, then rooms.hotels needs to be object too.
    // And hotels might be array too.
    // So I should flatten hotels inside rooms as well.
  })).map((booking: any) => {
    // Second pass to clean up hotels if needed
    if (booking.rooms && Array.isArray(booking.rooms.hotels)) {
      booking.rooms.hotels = booking.rooms.hotels[0];
    }
    return booking;
  });
}