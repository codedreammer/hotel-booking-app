import Link from 'next/link'
import { getHotelBookings } from './actions'
import BookingActions from '../../../bookings/BookingAction'

interface Props {
  params: Promise<{ hotelId: string }>
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; classes: string }> = {
    pending: {
      label: 'Pending',
      classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    confirmed: {
      label: 'Confirmed',
      classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    checked_in: {
      label: 'Checked In',
      classes: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    },
    checked_out: {
      label: 'Checked Out',
      classes: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-red-500/10 text-red-500 border-red-500/20'
    },
  }

  const config = configs[status.toLowerCase()] || configs.pending

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.classes}`}>
      {config.label}
    </span>
  )
}

export default async function HotelBookingsPage({ params }: Props) {
  const { hotelId } = await params

  if (!hotelId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="font-bold uppercase tracking-widest text-xs">Error: Hotel ID is missing</span>
        </div>
      </div>
    )
  }

  const bookings = await getHotelBookings(hotelId)

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href={`/owner/dashboard/hotels/${hotelId}`}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2.5 group-hover:-translate-x-1 transition-transform text-cyan-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Overview</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-4">
            Bookings
          </h1>
          <p className="text-white/40 text-lg font-medium">
            Manage and respond to guest reservations for your property.
          </p>
        </div>

        {bookings.length === 0 ? (
          /* Empty State */
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10 font-sans">
              <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-6xl shadow-inner border border-white/5">
                📅
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">No bookings yet</h3>
              <p className="text-white/40 max-w-sm mx-auto text-lg leading-relaxed font-medium">
                New reservations will appear here once guests start booking your property.
              </p>
            </div>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-3xl border border-white/5 hover:border-white/10 rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 flex-1">
                    {/* Guest & Room */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-2 leading-none">Guest</p>
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                          {booking.profiles?.full_name || 'Guest User'}
                        </h3>
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-2 leading-none">Category</p>
                        <p className="text-white/60 font-black text-xs uppercase tracking-widest leading-none">
                          {booking.room.room_type}
                        </p>
                      </div>
                    </div>

                    {/* Stay Dates */}
                    <div className="space-y-4">
                      <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-2 leading-none">Stay Period</p>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-white">{new Date(booking.check_in).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                          <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Check-in</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-cyan-500 opacity-30">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-white">{new Date(booking.check_out).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                          <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Check-out</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Price */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-3 leading-none">Status</p>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] mb-2 leading-none">Revenue</p>
                        <p className="text-2xl font-black text-emerald-400 leading-none">
                          ₹{booking.total_price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:pl-10 lg:border-l border-white/5 min-w-[200px]">
                    <BookingActions booking={booking} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}