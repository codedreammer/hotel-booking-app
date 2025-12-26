    import { createClient } from "@supabase/supabase-js"
    import HotelCard from "@/components/HotelCard"

    const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    export default async function HotelsPage() {
    const { data: hotels, error } = await supabase
        .from("hotels")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        return <p>Error loading hotels</p>
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Available Hotels</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {hotels?.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
        </div>
    )
    }

    