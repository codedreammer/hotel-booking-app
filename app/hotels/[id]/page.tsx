    import { createServerClient } from "@/lib/supabase/server"
    import HotelClient from "./HotelClient"

    type HotelPageProps = {
    params: Promise<{ id: string }>
    }

    export default async function HotelPage({ params }: HotelPageProps) {
    const { id } = await params

    const supabase = createServerClient()

    // Fetch hotel
    const { data: hotel, error: hotelError } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .single()

    // Fetch rooms
    const { data: rooms } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", id)

    if (hotelError || !hotel) {
        return <p className="text-red-500">Hotel not found</p>
    }

    return (
        <HotelClient
        hotel={hotel}
        rooms={rooms ?? []}
        />
    )
    }
