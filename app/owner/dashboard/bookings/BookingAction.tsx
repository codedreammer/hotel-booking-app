'use client'

import { updateBookingStatus } from './actions'

interface BookingActionsProps {
    booking: {
        id: string
        status: string
    }
}

export default function BookingActions({ booking }: BookingActionsProps) {
    async function handleStatusUpdate(status: 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out') {
        const res = await updateBookingStatus(booking.id, status)
        if (res?.error) alert(res.error)
        else window.location.reload()
    }

    return (
        <div className="flex flex-wrap gap-3">
            {booking.status === 'pending' && (
                <>
                    <button
                        onClick={() => handleStatusUpdate('confirmed')}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_8px_16px_-6px_rgba(6,182,212,0.5)]"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-all border border-white/5 hover:border-red-500/20 active:scale-95"
                    >
                        Cancel
                    </button>
                </>
            )}

            {booking.status === 'confirmed' && (
                <>
                    <button
                        onClick={() => handleStatusUpdate('checked_in')}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                    >
                        Check-in
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-all border border-white/5 hover:border-red-500/20 active:scale-95"
                    >
                        Cancel
                    </button>
                </>
            )}

            {booking.status === 'checked_in' && (
                <button
                    onClick={() => handleStatusUpdate('checked_out')}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                >
                    Check-out
                </button>
            )}

            {/* No actions for checked_out or cancelled */}
        </div>
    )
}
