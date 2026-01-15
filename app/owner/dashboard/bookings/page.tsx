import { getOwnerBookings } from "./actions";
import BookingActions from "./BookingAction";
import BookingsBackground from "@/components/BookingsBackground";
import Link from "next/link";

const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const BedIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

function getStatusStyles(status: string) {
    switch (status) {
        case 'confirmed':
            return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'cancelled':
            return 'bg-red-500/20 text-red-400 border border-red-500/30';
        case 'pending':
            return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        case 'checked_in':
            return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'checked_out':
            return 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30';
        default:
            return 'bg-white/10 text-white border border-white/20';
    }
}

export default async function OwnerBookingsPage() {
    const bookings = await getOwnerBookings();

    return (
        <div className="relative min-h-screen">
            <BookingsBackground />

            <div className="relative z-10 p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
                <header className="mb-12">
                    <Link
                        href="/owner/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 mb-8 group"
                    >
                        <ArrowLeftIcon />
                        <span className="text-sm font-medium tracking-wide">Back to Dashboard</span>
                    </Link>

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Bookings
                    </h1>
                    <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl font-light">
                        Monitor and manage all reservations across your properties from one central dashboard.
                    </p>
                </header>

                {bookings.length === 0 ? (
                    <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/10 shadow-2xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                            <CalendarIcon />
                        </div>
                        <h2 className="text-white text-2xl font-semibold mb-2">No bookings found</h2>
                        <p className="text-zinc-500">When guests book your rooms, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group bg-black/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-white/5"
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="space-y-6">
                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] ${getStatusStyles(booking.status)}`}>
                                                    {booking.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            {/* Hotel and Room Info */}
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                                                    {(booking.room as any).hotel.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-zinc-300 font-medium bg-white/5 py-1.5 px-3 rounded-lg w-fit">
                                                    <BedIcon />
                                                    <span className="text-sm">{(booking.room as any).room_type}</span>
                                                </div>
                                            </div>

                                            {/* Stay Dates */}
                                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                                <div className="flex items-center gap-3 text-zinc-400">
                                                    <div className="p-2 bg-white/5 rounded-lg text-white">
                                                        <CalendarIcon />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Stay Duration</span>
                                                        <span className="text-sm sm:text-base font-medium text-zinc-200">
                                                            {booking.check_in} — {booking.check_out}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                            <div className="bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10">
                                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-4 block">Available Actions</div>
                                                <BookingActions booking={booking} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
