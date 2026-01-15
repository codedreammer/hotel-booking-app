'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Hotel = {
  id: string
  name: string
  city: string
  created_at: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setHotels(data)
      }

      setLoading(false)
    }

    fetchHotels()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-3">
            <div className="h-10 w-48 bg-zinc-800 rounded-lg"></div>
            <div className="h-4 w-64 bg-zinc-800 rounded-lg"></div>
          </div>
          <div className="h-12 w-40 bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background Image with Slow Panning & Zoom Animation */}
      <div className="absolute inset-0 z-0 scale-110 animate-[pan_30s_infinite_alternate]">
        <img
          src="https://i.pinimg.com/1200x/ba/85/cb/ba85cb57685f144d128878655360a91b.jpg"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950" />
      </div>

      <style jsx global>{`
        @keyframes pan {
          0% { transform: scale(1) translateX(0); }
          50% { transform: scale(1.1) translateX(-2%); }
          100% { transform: scale(1) translateX(1%); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Properties</span>
            </h1>
            <p className="text-white/60 text-lg font-medium">
              Manage your hotel listings, pricing, and availability.
            </p>
          </div>
          <Link
            href="/owner/dashboard/hotels/new"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)] transition-all active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Hotel
          </Link>
        </div>

        {hotels.length === 0 ? (
          /* Empty State */
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="w-28 h-28 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-6xl shadow-inner border border-white/5">
                🏨
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                No active properties listed
              </h3>
              <p className="text-white/40 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
                Unlock professional booking management by adding your first luxury property today.
              </p>
              <Link
                href="/owner/dashboard/hotels/new"
                className="inline-flex items-center px-10 py-4.5 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-100 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95"
              >
                Launch Your First Hotel
              </Link>
            </div>
          </div>
        ) : (
          /* Hotel List */
          <div className="grid grid-cols-1 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-3xl border border-white/5 hover:border-cyan-500/30 rounded-[2.5rem] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 transition-all duration-500"
              >
                <div className="flex items-start gap-8">
                  <div className="hidden sm:flex w-24 h-24 bg-white/5 rounded-3xl items-center justify-center text-4xl group-hover:scale-105 group-hover:bg-cyan-500/10 transition-all duration-500 shadow-inner border border-white/5">
                    🏢
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">
                        {hotel.name}
                      </h3>
                      <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
                        Live Property
                      </span>
                    </div>
                    <div className="flex items-center text-white/40 font-bold text-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {hotel.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/hotels/${hotel.id}`}
                    className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 font-bold text-sm transition-all text-center border border-white/5 active:scale-95"
                  >
                    Guest View
                  </Link>
                  <Link
                    href={`/owner/dashboard/hotels/${hotel.id}`}
                    className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-white text-zinc-950 hover:bg-cyan-50 font-black text-sm shadow-xl transition-all text-center active:scale-95"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}