    import { getHotelAvailability } from "./actions";

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
    // ✅ unwrap async params
    const { id } = await params;
    const { check_in, check_out } = await searchParams;

    if (!check_in || !check_out) {
        return (
        <div className="p-6">
            <p className="text-red-400">Invalid date selection.</p>
        </div>
        );
    }

    const rooms = await getHotelAvailability(
        id,
        check_in,
        check_out
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
            Available Rooms
        </h1>

        {rooms.length === 0 && (
            <p className="text-gray-400">
            No rooms available for selected dates.
            </p>
        )}

        <div className="space-y-4">
            {rooms.map((room) => (
            <div
                key={room.id}
                className="border rounded-lg p-4 flex justify-between items-center"
            >
                <div>
                <h3 className="text-lg font-semibold">
                    {room.rooms_type}
                </h3>
                <p>Max guests: {room.max_guests}</p>
                <p>
                    Available rooms:{" "}
                    <b>{room.available_rooms}</b>
                </p>
                </div>

                <div className="text-right">
                <p className="text-xl font-bold">
                    ₹{room.price_per_night} / night
                </p>

                <a
                    href={
                    room.available_rooms > 0
                        ? `/bookings/new?room_id=${room.id}&check_in=${check_in}&check_out=${check_out}`
                        : "#"
                    }
                    className={`mt-2 inline-block px-4 py-2 rounded ${
                    room.available_rooms > 0
                        ? "bg-blue-600"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                    {room.available_rooms > 0
                    ? "Reserve"
                    : "Fully Booked"}
                </a>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }