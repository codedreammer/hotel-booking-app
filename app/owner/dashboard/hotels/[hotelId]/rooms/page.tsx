'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Room = {
  id: string
  rooms_type: string
  price_per_night: number
  total_rooms: number
  max_guests: number
  is_active: boolean
  image_url: string | null
}

export default function RoomsPage() {
  const params = useParams()
  const hotelId = params.hotelId as string

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setRooms(data)
      }

      setLoading(false)
    }

    fetchRooms()
  }, [hotelId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-10 w-48 bg-zinc-800 rounded-lg mb-4"></div>
        <div className="h-4 w-64 bg-zinc-800 rounded-lg mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] bg-zinc-900 border border-zinc-800 rounded-[2.5rem]"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href={`/owner/dashboard/hotels/${hotelId}`}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2.5 group-hover:-translate-x-1 transition-transform text-cyan-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Hotel</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
              Rooms
            </h1>
            <p className="text-white/40 text-lg font-medium max-w-xl">
              Manage room types, pricing, availability, and showcase your property with high-quality images.
            </p>
          </div>
          <Link
            href={`/owner/dashboard/hotels/${hotelId}/rooms/new`}
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)] transition-all active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Room
          </Link>
        </div>

        {rooms.length === 0 ? (
          /* Empty State */
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 font-sans">
              <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-6xl shadow-inner border border-white/5">
                🛏️
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">No rooms added yet</h3>
              <p className="text-white/40 max-w-sm mx-auto mb-12 text-lg leading-relaxed font-medium">
                Your property inventory is empty. Start by adding a room type to begin accepting bookings.
              </p>
              <Link
                href={`/owner/dashboard/hotels/${hotelId}/rooms/new`}
                className="inline-flex items-center px-10 py-4.5 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-100 transition-all shadow-xl active:scale-95"
              >
                Create Your First Room
              </Link>
            </div>
          </div>
        ) : (
          /* Rooms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-3xl border border-white/5 hover:border-cyan-500/30 rounded-[2.5rem] overflow-hidden transition-all duration-500"
              >
                {/* Room Image */}
                <div className="relative h-64 overflow-hidden">
                  {room.image_url ? (
                    <img
                      src={room.image_url}
                      alt={room.rooms_type}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-4xl">
                      🛏️
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border ${room.is_active
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                      {room.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                        {room.rooms_type}
                      </h3>
                      <div className="flex items-center text-white/40 text-sm font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5 text-cyan-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                        Up to {room.max_guests} guests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-white leading-none">₹{room.price_per_night}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">per night</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Availability</div>
                      <div className="text-white font-bold">{room.total_rooms} Rooms</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Status</div>
                      <div className={`font-bold ${room.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
                        {room.is_active ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/owner/dashboard/hotels/${hotelId}/rooms/${room.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-white text-zinc-950 font-black text-sm hover:bg-cyan-50 transition-all shadow-lg active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit Room
                    </Link>
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