    "use server"

    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"

    export async function updateRoom(
    roomId: string,
    updates: {
        price_per_night?: number
        total_rooms?: number
    }
    ) {
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

    // 1️⃣ Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    // 2️⃣ Ownership validation (CRITICAL)
    const { data: room, error } = await supabase
        .from("rooms")
        .select("id, hotel_id, hotels(owner_id)")
        .eq("id", roomId)
        .single()

    if (error || !room) {
        throw new Error("Room not found")
    }

    const hotel = room.hotels?.[0]

    if (!hotel || hotel.owner_id !== user.id) {
        throw new Error("Unauthorized")
    }

    // 3️⃣ Validate inputs (SMALL BUT IMPORTANT)
    if (
        updates.price_per_night !== undefined &&
        updates.price_per_night <= 0
    ) {
        throw new Error("Price must be greater than zero")
    }

    if (
        updates.total_rooms !== undefined &&
        updates.total_rooms < 0
    ) {
        throw new Error("Total rooms cannot be negative")
    }

    // 4️⃣ Update
    await supabase
        .from("rooms")
        .update(updates)
        .eq("id", roomId)

    return { success: true }
}
