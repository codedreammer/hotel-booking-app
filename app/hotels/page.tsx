import { getHotelsByCity } from "./actions";
import Link from "next/link";
import Header from "@/components/Header"
import SearchForm from "@/components/SearchForm"
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

  const hotels = city ? await getHotelsByCity(city) : [];

  // Helper to generate consistent mock data
  const getHotelMeta = (id: string) => {
    // Simple hash to consistency
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const price = 80 + (hash % 200);
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Search Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {city ? `Hotels in ${city}` : "Search Hotels"}
            </h1>
            {checkIn && checkOut && (
              <p className="text-gray-500">
                {new Date(checkIn).toLocaleDateString()} — {new Date(checkOut).toLocaleDateString()}
                {guests && ` • ${guests} Guest${Number(guests) > 1 ? 's' : ''}`}
              </p>
            )}
          </div>

          {/* Mini Search Form */}
          <SearchForm
            initialCity={city}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests ? Number(guests) : undefined}
            compact={true}
          />
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {hotels.length === 0 && city && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="text-gray-300 text-7xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hotels found in "{city}"
              </h3>
              <p className="text-gray-500">
                Try searching for a different destination or adjusting your dates.
              </p>
            </div>
          )}

          {hotels.map((hotel: any) => {
            const meta = getHotelMeta(hotel.id);
            return (
              <div key={hotel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="flex flex-col md:flex-row">
                  {/* Image Placeholder */}
                  <div className="md:w-72 h-48 md:h-auto relative bg-gray-200">
                    <img
                      src={meta.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 mb-3 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 10 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.001.001zM10 13a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                          </svg>
                          {hotel.city}
                        </p>
                        <p className="text-gray-500 line-clamp-2 max-w-2xl text-sm leading-relaxed">
                          {hotel.description || 'Experience a safe and comfortable stay. Verified for quality and safety standards.'}
                        </p>

                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                            ⭐ {hotel.star_rating || meta.rating.toFixed(1)}
                          </span>
                          <span>Verified Partner</span>
                          <span>Free Cancellation</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between border-t border-gray-50 pt-4">
                      <div className="text-gray-400 text-xs">
                        Includes taxes & fees
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{meta.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            per night
                          </div>
                        </div>
                        <Link
                          href={`/hotels/${hotel.id}?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`}
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                        >
                          View Deal
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}