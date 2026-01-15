'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Hotel = {
  id: string
  name: string
  city: string
  description: string | null
  star_rating: number | null
  image_url: string | null
}

export default function EditHotelForm({ hotel }: { hotel: Hotel }) {
  const router = useRouter()
  const [name, setName] = useState(hotel.name)
  const [city, setCity] = useState(hotel.city)
  const [description, setDescription] = useState(hotel.description || '')
  const [starRating, setStarRating] = useState(hotel.star_rating?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files])

      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Update basic info
      const { error: updateError } = await supabase
        .from('hotels')
        .update({
          name,
          city,
          description: description || null,
          star_rating: starRating ? parseInt(starRating) : null,
        })
        .eq('id', hotel.id)

      if (updateError) throw updateError

      // 2. Handle image uploads if any
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file, index) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${hotel.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('rooms')
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('rooms')
            .getPublicUrl(filePath)

          // If it's the first image ever (or we want to update the main one)
          if (index === 0 && !hotel.image_url) {
            await supabase
              .from('hotels')
              .update({ image_url: publicUrl })
              .eq('id', hotel.id)
          }

          // Also try to insert into hotel_images
          await supabase
            .from('hotel_images')
            .insert({
              hotel_id: hotel.id,
              image_url: publicUrl
            })

          return publicUrl
        })

        await Promise.all(uploadPromises)
      }

      router.push(`/owner/dashboard/hotels/${hotel.id}`)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update hotel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleUpdateHotel}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
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

        {/* Section: Hotel Images */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 ml-1">
                Hotel Visual Gallery
              </label>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider ml-1">
                Update your property's imagery
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                {imageFiles.length} New Images
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="aspect-video w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/[0.02] transition-all flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-2xl shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  📸
                </div>
                <div className="text-sm font-black text-white/60 mb-1">Upload New Photos</div>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed max-w-[140px]">
                  Add more high-quality visuals
                </p>
              </div>
            </div>

            {/* Previews Grid */}
            <div className="grid grid-cols-2 gap-3 min-h-[120px]">
              {imagePreviews.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-3xl bg-white/[0.01] border border-white/5 border-dashed p-4">
                  {hotel.image_url ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src={hotel.image_url} alt="Current" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Showing Primary Image</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] italic">
                      No new images selected
                    </p>
                  )}
                </div>
              ) : (
                imagePreviews.slice(0, 4).map((preview, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl group/preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                    />
                    {i === 3 && imagePreviews.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-black text-xs">+{imagePreviews.length - 4} More</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 pt-4 border-t border-white/5">
          <Link
            href={`/owner/dashboard/hotels/${hotel.id}`}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 hover:text-white border border-white/5 transition-all duration-300 text-center"
          >
            Discard
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center min-w-[200px] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Synchronizing...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}