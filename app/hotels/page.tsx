import { getHotelsByCity } from "./actions";
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import SearchForm from "@/components/SearchForm"
import { HotelWithMeta } from "@/components/HotelCard"
import HotelSearchResults from "@/components/HotelSearchResults"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function getUser() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { ...user, role: profile?.role }
}

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    check_in?: string;
    check_out?: string;
    guests?: string;
  }>;
}) {
  const params = await searchParams;
  const user = await getUser();

  const city = params.city ?? "";
  const checkIn = params.check_in ?? "";
  const checkOut = params.check_out ?? "";
  const guests = params.guests ?? "";

  const hotelsData = city ? await getHotelsByCity(city) : [];

  // Helper to generate consistent mock data (UI only)
  const getHotelMeta = (id: string) => {
    // Simple hash to consistency
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const price = 2500 + (hash % 50) * 100; // Realistic INR price range
    const images = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-6e5a51335022?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ];

    const allAmenities = [
      "WiFi",
      "Pool",
      "Gym",
      "Spa",
      "Restaurant",
      "Parking",
      "Pet Friendly",
      "Room Service"
    ];

    // Derive amenities from hash
    const amenities = allAmenities.filter((_, index) => (hash + index) % 3 === 0);
    if (amenities.length === 0) amenities.push(allAmenities[hash % allAmenities.length]);

    return {
      price,
      image: images[hash % images.length],
      rating: 4.0 + (hash % 10) / 10,
      amenities
    };
  };

  const hotels: HotelWithMeta[] = hotelsData.map((h: any) => {
    const meta = getHotelMeta(h.id);
    return {
      ...h,
      ...meta,
      image: h.image_url || meta.image
    };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative overflow-hidden text-gray-900">
      <AnimatedBackground src="https://i.pinimg.com/736x/9a/9f/19/9a9f1912a9bef60c826180489a081fa7.jpg" />
      <Header user={user} />

      {/* Top Search Section */}
      <div className="bg-white/80 border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchForm
            initialCity={city}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests ? Number(guests) : undefined}
            compact={true}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <HotelSearchResults
          initialHotels={hotels}
          city={city}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
        />
      </main>
    </div>
  );
}