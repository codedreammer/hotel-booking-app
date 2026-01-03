"use client";

import { cancelBooking } from "./action";
import { useState } from "react";

export default function BookingCard({ booking }: { booking: any }) {
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const res = await cancelBooking(booking.id);
    if (res?.error) alert(res.error);
    else window.location.reload();
  }

  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="border rounded-lg p-4 bg-black">
      <p>{booking.check_in} → {booking.check_out}</p>
      <p>Status: <b>{booking.status}</b></p>

      {canCancel && (
        <button
          disabled={loading}
          onClick={handleCancel}
          className="mt-2 px-3 py-1 bg-red-600 rounded text-sm"
        >
          {loading ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
}