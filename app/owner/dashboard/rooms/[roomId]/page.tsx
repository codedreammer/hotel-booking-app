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

    if (error || !rooms) {
        return <p className="p-6">Room not found</p>
    }

    const room = rooms.find(r => r.id === roomId)
    if (!room) {
        return <p className="p-6">Room not found</p>
    }

    const hotel = room.hotels?.[0]
    if (!hotel || hotel.owner_id !== user.id) {
        return <p className="p-6">Unauthorized</p>
    }

    return (
        <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">
            Edit Room: {room.rooms_type}
        </h1>
        <RoomEditForm room={room} />
        </div>
    )
    }
