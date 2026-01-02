    "use client";

    import { updateBookingStatus } from "./actions";

    interface BookingActionsProps {
    booking: {
        id: string;
        status: string;
    };
    }

    export default function BookingActions({ booking }: BookingActionsProps) {
    async function handleStatusUpdate(
        status: "confirmed" | "cancelled" | "checked_in" | "checked_out"
    ) {
        const res = await updateBookingStatus(booking.id, status);
        if (res?.error) alert(res.error);
        else window.location.reload();
    }

    return (
        <div className="flex gap-2">
        {booking.status === "pending" && (
            <button
            onClick={() => handleStatusUpdate("confirmed")}
            className="px-3 py-1 rounded text-sm bg-blue-600"
            >
            Confirm
            </button>
        )}

        {booking.status === "confirmed" && (
            <button
            onClick={() => handleStatusUpdate("checked_in")}
            className="px-3 py-1 rounded text-sm bg-blue-600"
            >
            Check-in
            </button>
        )}

        {booking.status === "checked_in" && (
            <button
            onClick={() => handleStatusUpdate("checked_out")}
            className="px-3 py-1 rounded text-sm bg-blue-600"
            >
            Check-out
            </button>
        )}

        {booking.status !== "cancelled" && (
            <button
            onClick={() => handleStatusUpdate("cancelled")}
            className="px-3 py-1 rounded text-sm bg-red-600"
            >
            Cancel
            </button>
        )}
        </div>
    );
    }
