'use client'

import Link from 'next/link'
import { updateHotel } from './actions'

type Hotel = {
  id: string
  name: string
  city: string
  description: string | null
  star_rating: number | null
}

export default function EditHotelForm({ hotel }: { hotel: Hotel }) {
  return (
    <form
      action={updateHotel.bind(null, hotel.id)}
      className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group shadow-cyan-500/5 mb-10"
    >
      {/* Enhanced Glow Effects */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full" />

      <div className="space-y-10 relative z-10">
        {/* Section: Hotel Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="col-span-1 sm:col-span-1">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">
              Property Name
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-cyan-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={hotel.name}
                required
                className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500"
                placeholder="Grand Oasis Resort"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">
              City Location
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-cyan-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={hotel.city}
                required
                className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500"
                placeholder="Maldives"
              />
            </div>
          </div>
        </div>

        {/* Section: Details & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">
              Story Description
            </label>
            <div className="relative group/input">
              <div className="absolute top-5 left-5 pointer-events-none text-white/20 group-focus-within/input:text-cyan-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.051Z" />
                </svg>
              </div>
              <textarea
                id="description"
                name="description"
                defaultValue={hotel.description || ''}
                rows={4}
                className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-5 py-5 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500 resize-none"
                placeholder="Tell the unique story of your property..."
              />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">
              Premium Rating
            </label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-cyan-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <select
                id="star_rating"
                name="star_rating"
                defaultValue={hotel.star_rating || ''}
                className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-10 py-4 text-white appearance-none focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500"
              >
                <option value="" className="bg-zinc-900">Select rating</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num} className="bg-zinc-900">{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 pt-4">
          <Link
            href={`/owner/dashboard/hotels/${hotel.id}`}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 hover:text-white border border-white/5 transition-all duration-300 text-center"
          >
            Discard
          </Link>

          <button
            type="submit"
            className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center min-w-[200px]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  )
}