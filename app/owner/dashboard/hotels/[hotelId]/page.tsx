'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Hotel = {
  id: string
  name: string
  city: string
  description: string | null
}

export default function HotelOverviewPage() {
  const params = useParams()
  const hotelId = params.hotelId as string

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotel = async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, description')
        .eq('id', hotelId)
        .single()

      if (!error && data) {
        setHotel(data)
      }

      setLoading(false)
    }

    fetchHotel()
  }, [hotelId])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-white/40 font-medium animate-pulse">Initializing Control Center...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-white mb-2">Hotel Not Found</h2>
          <p className="text-white/40 mb-6">We couldn't locate the property you're looking for.</p>
          <Link href="/owner/dashboard/hotels" className="inline-flex items-center px-6 py-3 bg-white text-zinc-950 font-black rounded-xl">
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden">
      {/* Hero Section with Animated Background */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1601504410148-0c269aafd95c"
            alt={hotel.name}
            className="w-full h-full object-cover animate-[slowZoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/20" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <Link
            href="/owner/dashboard/hotels"
            className="inline-flex items-center text-white/70 hover:text-white mb-12 transition-all w-fit group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mr-4 group-hover:-translate-x-1 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em]">Back to Properties</span>
          </Link>

          <div className="animate-[slideUp_0.8s_ease-out]">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-cyan-500/30">
                Primary Branch
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-emerald-500/30">
                Status: Active
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter mb-4 leading-none">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-6 text-white/60 font-medium text-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-cyan-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {hotel.city}
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.499Z" />
                </svg>
                4.8 Rating
              </div>
            </div>
            {hotel.description && (
              <p className="max-w-2xl text-white/50 mt-8 text-lg leading-relaxed font-medium line-clamp-2">
                {hotel.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-12 relative z-20">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Rooms', value: '—', icon: '🏨', color: 'from-blue-600/20' },
            { label: 'Active Bookings', value: '—', icon: '📅', color: 'from-emerald-600/20' },
            { label: 'Check-ins', value: '—', icon: '🔑', color: 'from-purple-600/20' },
            { label: 'Occupancy Rate', value: '—%', icon: '📈', color: 'from-cyan-600/20' },
          ].map((stat, i) => (
            <div key={i} className={`bg-zinc-900/80 backdrop-blur-2xl border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stat.color} to-transparent border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-xs font-black uppercase tracking-[0.1em]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Primary Action Cards */}
        <div className="mb-16">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-2">Management Terminal</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`/owner/dashboard/hotels/${hotelId}/rooms`}
              className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-cyan-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[60px] rounded-full group-hover:bg-cyan-600/20 transition-all" />
              <div className="relative z-10 text-center sm:text-left">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-white/5">
                  🛏️
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors">Manage Rooms</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Add, edit, and optimize your property inventory and daily rates.
                </p>
              </div>
            </Link>

            <Link
              href={`/owner/dashboard/hotels/${hotelId}/bookings`}
              className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-emerald-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 blur-[60px] rounded-full group-hover:bg-emerald-600/20 transition-all" />
              <div className="relative z-10 text-center sm:text-left">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-3xl group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-inner border border-white/5">
                  📅
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">View Bookings</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Real-time reservation tracking and guest check-in management.
                </p>
              </div>
            </Link>

            <Link
              href={`/owner/dashboard/hotels/${hotelId}/edit`}
              className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 blur-[60px] rounded-full group-hover:bg-amber-600/20 transition-all" />
              <div className="relative z-10 text-center sm:text-left">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner border border-white/5">
                  ⚙️
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-amber-400 transition-colors">Edit Hotel</h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Update property details, address, amenities, and policies.
                </p>
              </div>
            </Link>

            <div className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/[0.05] hover:border-purple-500/50 transition-all duration-500 overflow-hidden opacity-80">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full group-hover:bg-purple-600/20 transition-all" />
              <div className="relative z-10 text-center sm:text-left">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-3xl group-hover:scale-110 group-hover:-rotate-12 transition-all shadow-inner border border-white/5">
                  💰
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-2xl font-black text-white tracking-tight">Pricing</h3>
                  <span className="text-[8px] bg-purple-500 px-1.5 py-0.5 rounded text-white font-black uppercase tracking-tighter">New</span>
                </div>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Dynamic pricing engine and seasonal availability calendar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Management Features */}
        <div className="pb-24">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 px-2">Property Analytics & Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Amenities', icon: '✨', count: '12 active' },
              { title: 'House Rules', icon: '📜', count: 'Standard' },
              { title: 'Policies', icon: '🛡️', count: 'View info' },
              { title: 'Gallery', icon: '📸', count: '8 photos' },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all text-left">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                  {item.icon}
                </div>
                <div>
                  <div className="text-white font-bold leading-none mb-1.5">{item.title}</div>
                  <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">{item.count}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}