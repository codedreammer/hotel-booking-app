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
    try {
      await updateBookingStatus(bookingId, status);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${danger
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
        }`}
    >
      {label}
    </button>
  );
}