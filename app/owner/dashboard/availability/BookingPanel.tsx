"use client";

import { updateBookingStatus } from "../bookings/actions";
import { format } from "date-fns";

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
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${danger
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
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
        <>
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-40"
                onClick={onClose}
            />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {roomName}
                        </h2>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {format(new Date(date), "MMMM d, yyyy")}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {bookings.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No bookings for this date.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                Bookings ({bookings.length})
                            </h3>
                            {bookings.map((b) => (
                                <div key={b.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-4 transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Stay Duration</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                                {format(new Date(b.check_in), "MMM d")} — {format(new Date(b.check_out), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ${b.status === 'confirmed' ? 'text-emerald-500' :
                                                b.status === 'pending' ? 'text-amber-500' :
                                                    b.status === 'cancelled' ? 'text-rose-500' : 'text-blue-500'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-200/50 dark:border-gray-800/50">
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
            </div>
        </>
    );
}
