    "use server"

    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import { redirect } from "next/navigation"

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
            getAll() {
                return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                )
            },
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
        .select(`
          id, 
          hotel_id, 
          hotels!inner (
            id,
            owner_id
          )
        `)
        .eq("id", roomId)
        .eq("is_active", true)
        .single()

    if (error || !room) {
        throw new Error("Room not found")
    }

    if (!room.hotels || (room.hotels as any).owner_id !== user.id) {
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

export async function deleteRoom(roomId: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
            return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
            )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // 🔐 Ownership validation (MANDATORY)
  const { data: room, error } = await supabase
    .from("rooms")
    .select(`
      id, 
      hotels!inner (
        id,
        owner_id
      )
    `)
    .eq("id", roomId)
    .eq("is_active", true)
    .single()

  if (error || !room || !room.hotels || (room.hotels as any).owner_id !== user.id) {
    return { error: "Unauthorized" }
  }

  // Check for active bookings
  const today = new Date().toISOString().split("T")[0]

  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId)
    .in("status", ["pending", "confirmed", "checked_in"])
    .gte("check_out", today)

  if (count && count > 0) {
    return {
      error: "Room has active or upcoming bookings",
    }
  }

  await supabase
    .from("rooms")
    .update({ is_active: false })
    .eq("id", roomId)

  return { success: true }
}
