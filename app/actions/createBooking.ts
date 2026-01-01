    "use server"

    import { getSupabaseServerClient } from "@/lib/supabase/server"
    import { checkRoomAvailability } from "./availability"

    type CreateBookingParams = {
    roomId: string
    checkIn: string
    checkOut: string
    totalPrice: number
    }

    export async function createBooking({
    roomId,
    checkIn,
    checkOut,
    totalPrice,
    }: CreateBookingParams) {
    // 🔒 FINAL availability guard
    const { available, remaining } = await checkRoomAvailability(
    roomId,
    checkIn,
    checkOut
    );

    if (!available) {
    throw new Error("No rooms available for selected dates");
    }


    const supabase = await getSupabaseServerClient()

        const {
    data: { user },
    error: authError,
} = await supabase.auth.getUser()

console.log("AUTH USER:", user)


    if (!user) {
        return { error: "User not authenticated" }
    }

    const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        status: "confirmed",
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
    }
