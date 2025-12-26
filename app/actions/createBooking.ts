    "use server"

    import { createServerClient } from "@/lib/supabase/server"

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
    const supabase = createServerClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

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
