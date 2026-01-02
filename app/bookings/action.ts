    "use server";

    import { cookies } from "next/headers";
    import { createServerClient } from "@supabase/ssr";

    export async function cancelBooking(bookingId: string) {
    const cookieStore = await cookies();

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

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Fetch booking
    const { data: booking, error } = await supabase
        .from("bookings")
        .select("id, user_id, check_in, status")
        .eq("id", bookingId)
        .single();

    if (error || !booking) return { error: "Booking not found" };

    if (booking.user_id !== user.id) {
        return { error: "Unauthorized" };
    }

    // ❌ Cannot cancel after check-in
    const today = new Date().toISOString().split("T")[0];

    if (booking.check_in <= today) {
        return { error: "Cannot cancel after check-in date" };
    }

    if (["checked_in", "checked_out"].includes(booking.status)) {
        return { error: "Cannot cancel this booking" };
    }

    await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

    return { success: true };
    }