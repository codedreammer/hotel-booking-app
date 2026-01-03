import { getHotelsByCity } from "./actions";
import Link from "next/link";

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    check_in?: string;
    check_out?: string;
  }>;
}) {
  const params = await searchParams;

  const city = params.city ?? "";
  const checkIn = params.check_in ?? "";
  const checkOut = params.check_out ?? "";

  const hotels = city ? await getHotelsByCity(city) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900 dark:text-white">
              Hotel Booking Platform
            </Link>
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        {city && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Hotels in {city}
            </h1>
            {checkIn && checkOut && (
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Refine Search */}
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              name="city"
              defaultValue={city}
              placeholder="City"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-zinc-700 dark:text-white"
              required
            />
            <input
              type="date"
              name="check_in"
              defaultValue={checkIn}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-zinc-700 dark:text-white"
              required
            />
            <input
              type="date"
              name="check_out"
              defaultValue={checkOut}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-zinc-700 dark:text-white"
              required
            />
            <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
              Update Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {hotels.length === 0 && city && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏨</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hotels found in {city}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try searching for a different city or check your spelling.
              </p>
            </div>
          )}

          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      📍 {hotel.city}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {hotel.description || 'A comfortable stay awaits you.'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>⭐ 4.5 (123 reviews)</span>
                      <span>🚗 Free parking</span>
                      <span>📶 Free WiFi</span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      $120
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      per night
                    </div>
                    <Link
                      href={`/hotels/${hotel.id}?check_in=${checkIn}&check_out=${checkOut}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}