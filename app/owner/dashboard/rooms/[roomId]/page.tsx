    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import RoomEditForm from "./room-edit-form"

    export default async function EditRoomPage({
    params,
    }: {
    params: Promise<{ roomId: string }>
    }) {
    const { roomId } = await params

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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    console.log("SERVER USER:", user)

    if (!user) {
        return <p className="p-6">Unauthorized</p>
    }

    const {
        data: rooms,
        error
    } = await supabase
        .from("rooms")
        .select(`
        id,
        rooms_type,
        price_per_night,
        total_rooms,
        max_guests,
        hotels!inner (
            id,
            name,
            owner_id
        )
        `)
        .eq("hotels.owner_id", user.id)
        .eq("id", roomId)
        .single()

    if (error || !rooms) {
        return <p className="p-6">Room not found</p>
    }

    if (!rooms.hotels || rooms.hotels.owner_id !== user.id) {
        return <p className="p-6">Unauthorized</p>
    }

    return (
        <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">
            Edit Room: {rooms.rooms_type}
        </h1>
        <RoomEditForm room={rooms} />
        </div>
    )
    }
