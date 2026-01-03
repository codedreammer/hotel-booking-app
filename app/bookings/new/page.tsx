    "use client";

    import { useState } from "react";
    import { createBooking } from "@/app/actions/createBooking";
    import { useSearchParams, useRouter } from "next/navigation";

    export default function NewBookingPage() {
    const params = useSearchParams();
    const router = useRouter();

    const roomId = params.get("room_id");
    const checkIn = params.get("check_in");
    const checkOut = params.get("check_out");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!roomId || !checkIn || !checkOut) {
        return <p className="p-6 text-red-400">Invalid booking request</p>;
    }

    async function handleConfirm() {
        setLoading(true);
        setError(null);

        const res = await createBooking(roomId!, checkIn!, checkOut!);

        if (res?.error) {
        setError(res.error);
        setLoading(false);
        } else {
        router.push("/bookings");
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
            Confirm Booking
        </h1>

        <p className="mb-4">
            {checkIn} → {checkOut}
        </p>

        {error && (
            <p className="text-red-400 mb-3">{error}</p>
        )}

        <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded w-full"
        >
            {loading ? "Booking..." : "Confirm Booking"}
        </button>
        </div>
    );
    }
