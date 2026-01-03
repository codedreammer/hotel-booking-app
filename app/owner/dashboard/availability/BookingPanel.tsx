    "use client";

    import { updateBookingStatus } from "../bookings/actions";

        function ActionButton({
        bookingId,
        status,
        label,
        danger,
        refresh,
        }: {
        bookingId: string;
        status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
        label: string;
        danger?: boolean;
        refresh: () => Promise<void>;
        }) {
        async function handleClick() {
            const res = await updateBookingStatus(bookingId, status);
            if (res?.error) alert(res.error);
            else await refresh();
        }

        return (
            <button
            onClick={handleClick}
            className={`px-3 py-1 rounded text-sm ${
                danger ? "bg-red-600" : "bg-blue-600"
            }`}
            >
            {label}
            </button>
        );
        }

        export default function BookingPanel({
        roomName,
        date,
        bookings,
        onClose,
        refresh,
        }: {
        roomName: string;
        date: string;
        bookings: any[];
        onClose: () => void;
        refresh: () => Promise<void>;
        }) {
        return (
            <div className="fixed right-0 top-0 h-full w-96 bg-black border-l p-4 z-50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                {roomName} — {date}
                </h2>
                <button onClick={onClose} className="text-gray-400">✕</button>
            </div>

            {bookings.length === 0 ? (
                <p className="text-gray-400">No bookings for this date.</p>
            ) : (
                <div className="space-y-3">
                {bookings.map((b) => (
                <div key={b.id} className="border rounded p-3 space-y-2">
                    <p className="text-sm">
                    {b.check_in} → {b.check_out}
                    </p>

                    <p>
                    Status: <b>{b.status}</b>
                    </p>

                    <div className="flex gap-2 flex-wrap">
                    {b.status === "pending" && (
                        <ActionButton bookingId={b.id} status="confirmed" label="Confirm" refresh={refresh} />
                    )}

                    {b.status === "confirmed" && (
                        <ActionButton bookingId={b.id} status="checked_in" label="Check-in" refresh={refresh} />
                    )}

                    {b.status === "checked_in" && (
                        <ActionButton bookingId={b.id} status="checked_out" label="Check-out" refresh={refresh} />
                    )}

                    {b.status !== "cancelled" && (
                        <ActionButton
                        bookingId={b.id}
                        status="cancelled"
                        label="Cancel"
                        danger
                        refresh={refresh}
                        />
                    )}
                    </div>
                </div>
                ))}
                </div>
            )}
            </div>
        );
        }
