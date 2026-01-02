    "use client";

    export default function BookingPanel({
    roomName,
    date,
    bookings,
    onClose,
    }: {
    roomName: string;
    date: string;
    bookings: any[];
    onClose: () => void;
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
                <div key={b.id} className="border rounded p-3">
                <p>
                    {b.check_in} → {b.check_out}
                </p>
                <p>Status: <b>{b.status}</b></p>
                <p className="text-xs text-gray-500">
                    ID: {b.id.slice(0, 8)}
                </p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
    }
