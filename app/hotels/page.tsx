import { getHotelsByCity } from "./actions";
import Header from "@/components/Header"
import AnimatedBackground from "@/components/AnimatedBackground"
import SearchForm from "@/components/SearchForm"
import FilterSidebar from "@/components/FilterSidebar"
import HotelCard, { HotelWithMeta } from "@/components/HotelCard"
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
    return {
      price,
      image: images[hash % images.length],
      rating: 4.0 + (hash % 10) / 10
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
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar (Filters) */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              {/* Mobile Toggle can be added here if needed, for now using standard visibility classes */}
              <div className="block">
                <FilterSidebar />
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <div className="flex-1">
            {/* Header & Count */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {city ? `${hotels.length} hotels in ${city}` : "Explore Hotels"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {checkIn && checkOut
                  ? `${new Date(checkIn).toLocaleDateString()} — ${new Date(checkOut).toLocaleDateString()} • ${guests} Guests`
                  : "Find your perfect stay"
                }
              </p>
            </div>

            {/* Grid */}
            {hotels.length === 0 && city ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="text-gray-300 text-6xl mb-4">🏨</div>
                <h3 className="text-lg font-semibold text-gray-900">No hotels found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    searchParams={{ city, check_in: checkIn, check_out: checkOut, guests }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}