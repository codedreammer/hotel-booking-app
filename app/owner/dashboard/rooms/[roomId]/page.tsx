import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import Link from "next/link"
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
                getAll: () => cookieStore.getAll(),
                setAll: () => { },
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
        .eq("id", roomId)
        .single()

    if (error || !rooms) {
        return <p className="p-6">Room not found</p>
    }

    const hotel = Array.isArray(rooms.hotels) ? rooms.hotels[0] : rooms.hotels;

    if (!hotel || hotel.owner_id !== user.id) {
        return <p className="p-6">Unauthorized</p>
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/owner/dashboard" className="text-gray-500 hover:text-gray-900 font-medium text-sm">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Edit Room: <span className="text-blue-600">{rooms.rooms_type}</span>
                    </h1>
                    <RoomEditForm room={rooms} />
                </div>
            </div>
        </div>
    )
}
