import BackgroundImage from "@/components/BackgroundImage";
import { getHotelAvailability } from "./actions";
import Header from "@/components/Header";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

async function getUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return { ...user, role: profile?.role };
}

export default async function HotelPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        check_in?: string;
        check_out?: string;
    }>;
}) {
    const { id } = await params;
    const { check_in, check_out } = await searchParams;
    const user = await getUser();

    if (!check_in || !check_out) {
        return (
            <div className="min-h-screen font-sans relative">
                <BackgroundImage />
                <Header user={user} />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 inline-block">
                        <p className="text-red-500 font-medium mb-4">Please select check-in and check-out dates to view availability.</p>
                        <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const rooms = await getHotelAvailability(id, check_in, check_out);

    return (
        <div className="min-h-screen font-sans relative">
            <BackgroundImage />
            <Header user={user} />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href={`/hotels?city=&check_in=${check_in}&check_out=${check_out}`} className="text-sm text-white/70 hover:text-white mb-4 inline-block transition-colors">
                        ← Back to Results
                    </Link>
                    <h1 className="text-3xl font-bold text-white shadow-sm">Available Rooms</h1>
                    <p className="text-white/80 mt-2 text-lg font-medium shadow-sm">
                        {new Date(check_in).toLocaleDateString()} — {new Date(check_out).toLocaleDateString()}
                    </p>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No rooms available for the selected dates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 bg-gray-100 relative">
                                    {room.image_url ? (
                                        <img
                                            src={room.image_url}
                                            alt={room.rooms_type}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        /* Placeholder for Room Image */
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-200">
                                            <span className="text-4xl">🛏️</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.rooms_type}</h3>

                                    <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                                        <div className="flex justify-between">
                                            <span>Max Guests:</span>
                                            <span className="font-medium text-gray-900">{room.max_guests}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Available:</span>
                                            <span className="font-medium text-gray-900">{room.available_rooms} rooms</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">₹{room.price_per_night}</span>
                                            <span className="text-xs text-gray-500 block">per night</span>
                                        </div>

                                        <a
                                            href={
                                                room.available_rooms > 0
                                                    ? `/bookings/new?room_id=${room.id}&check_in=${check_in}&check_out=${check_out}`
                                                    : "#"
                                            }
                                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${room.available_rooms > 0
                                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                }`}
                                        >
                                            {room.available_rooms > 0 ? "Book Now" : "Sold Out"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}