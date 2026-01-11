"use client";

import { useState } from "react";
import { createBooking } from "@/app/actions/createBooking";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingForm({
    roomId,
    checkIn,
    checkOut,
}: {
    roomId: string;
    checkIn: string;
    checkOut: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-50 border border-gray-100 p-8 max-w-lg mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Confirm Your Stay</h2>
                <p className="text-gray-500 mt-2">You are one step away from your getaway</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Check-in</span>
                    <span className="text-gray-900 font-bold">{new Date(checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Check-out</span>
                    <span className="text-gray-900 font-bold">{new Date(checkOut).toLocaleDateString()}</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={async () => {
                        setLoading(true);
                        setError(null);

                        const res = await createBooking(roomId, checkIn, checkOut);

                        if (res?.error) {
                            setError(res.error);
                            setLoading(false);
                        } else {
                            router.push("/bookings");
                        }
                    }}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${loading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        }`}
                >
                    {loading ? "Confirming..." : "Confirm & Pay"}
                </button>

                <Link href="/" className="block text-center text-gray-500 hover:text-gray-900 text-sm font-medium">
                    Cancel and return home
                </Link>
            </div>
        </div>
    );
}
