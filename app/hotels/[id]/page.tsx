    import { createServerClient } from "@/lib/supabase/server"

    type HotelPageProps = {
    params: Promise<{ id: string }>
    }

    export default async function HotelPage({ params }: HotelPageProps) {
    const { id } = await params   // 🔥 THIS FIXES IT

    const supabase = createServerClient()

    const { data: hotel, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !hotel) {
        return <div>Hotel not found</div>
    }

    return (
        <div>
        <h1>{hotel.name}</h1>
        <p>{hotel.description}</p>
        </div>
    )
    }
