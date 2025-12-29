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
        .single()

    if (error || !room) {
        throw new Error("Room not found")
    }

    if (!room.hotels || room.hotels.owner_id !== user.id) {
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

export async function deleteRoom(formData: FormData) {
  const roomId = formData.get("room_id") as string

  if (!roomId) throw new Error("Room ID missing")

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
  if (!user) throw new Error("Unauthorized")

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
    .single()

  if (error || !room || !room.hotels || room.hotels.owner_id !== user.id) {
    throw new Error("Unauthorized")
  }


  // 🗑️ Delete room
  await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId)

  redirect("/owner/dashboard")
}
