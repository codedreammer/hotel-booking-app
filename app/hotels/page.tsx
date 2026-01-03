    import { getHotelsByCity } from "./actions";

    export default async function HotelsPage({
    searchParams,
    }: {
    searchParams: Promise<{
        city?: string;
        check_in?: string;
        check_out?: string;
    }>;
    }) {
    // ✅ IMPORTANT: await searchParams
    const params = await searchParams;

    const city = params.city ?? "";
    const checkIn = params.check_in ?? "";
    const checkOut = params.check_out ?? "";

    const hotels = city
        ? await getHotelsByCity(city)
        : [];

    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Search Hotels</h1>

        {/* SEARCH FORM */}
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
            name="city"
            defaultValue={city}
            placeholder="City"
            className="border rounded px-3 py-2 bg-black"
            required
            />

            <input
            type="date"
            name="check_in"
            defaultValue={checkIn}
            className="border rounded px-3 py-2 bg-black"
            required
            />

            <input
            type="date"
            name="check_out"
            defaultValue={checkOut}
            className="border rounded px-3 py-2 bg-black"
            required
            />

            <button className="bg-blue-600 rounded px-4 py-2">
            Search
            </button>
        </form>

        {/* RESULTS */}
        <div className="space-y-4">
            {hotels.length === 0 && city && (
            <p className="text-gray-400">No hotels found.</p>
            )}

            {hotels.map((hotel) => (
            <a
                key={hotel.id}
                href={`/hotels/${hotel.id}?check_in=${checkIn}&check_out=${checkOut}`}
                className="block border rounded p-4 hover:bg-gray-900"
            >
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p className="text-gray-400">{hotel.city}</p>
            </a>
            ))}
        </div>
        </div>
    );
    }