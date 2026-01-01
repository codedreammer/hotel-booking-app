    import { cookies } from "next/headers"
    import { createServerClient } from "@supabase/ssr"
    import { createRoom } from "./actions"

    export default async function NewRoomPage({ params }: { params: Promise<{ hotelsId: string }> }) {
    const { hotelsId } = await params
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return <p className="p-6">Unauthorized</p>

    // 🔐 Ownership validation
    const { data: hotel } = await supabase
        .from("hotels")
        .select("id")
        .eq("id", hotelsId)
        .eq("owner_id", user.id)
        .single()

    if (!hotel) return <p className="p-6">Unauthorized</p>

    return (
        <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Add Room</h1>

        <form action={createRoom}>
            <input type="hidden" name="hotel_id" value={hotelsId} />

            <input name="rooms_type" placeholder="Room Type" required className="input" />
            <input name="price_per_night" type="number" placeholder="Price" required className="input" />
            <input name="total_rooms" type="number" placeholder="Total Rooms" required className="input" />
            <input name="max_guests" type="number" placeholder="Max Guests" required className="input" />

            <button className="mt-4 w-full bg-blue-600 py-2 rounded">
            Create Room
            </button>
        </form>
        </div>
    )
    }
