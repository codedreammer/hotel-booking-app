"use client";

import { updateBookingStatus } from "../bookings/actions";

export default function ActionButton({
  bookingId,
  status,
  label,
  danger = false,
}: {
  bookingId: string;
  status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  label: string;
  danger?: boolean;
}) {
  const handleClick = async () => {
    await updateBookingStatus(bookingId, status);
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 text-sm rounded ${
        danger
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {label}
    </button>
  );
}