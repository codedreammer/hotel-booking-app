    "use server"

    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"

    export async function cancelBooking(bookingId: string) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get: (name) => cookieStore.get(name)?.value,
        },
        }
    )

    // Fetch booking to validate rules
    const { data: booking, error } = await supabase
        .from("bookings")
        .select("id, check_in, status")
        .eq("id", bookingId)
        .single()

    if (error || !booking) {
        throw new Error("Booking not found")
    }

    if (booking.status !== "confirmed") {
        throw new Error("Booking cannot be cancelled")
    }

    if (new Date(booking.check_in) <= new Date()) {
        throw new Error("Cannot cancel a booking that has already started")
    }

    const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)

    if (updateError) {
        throw new Error("Failed to cancel booking")
    }

    return { success: true }
    }
