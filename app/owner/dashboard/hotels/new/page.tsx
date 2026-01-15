'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AddHotelPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleCreateHotel = async () => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      // 1. Create the hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .insert({
          name,
          city,
          address,
          description,
          owner_id: user.id,
        })
        .select('id')
        .single()

      if (hotelError) throw hotelError

      const hotelId = hotelData.id

      // 2. Upload images and associate them
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file, index) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${hotelId}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('rooms') // Reusing 'rooms' bucket as its the standard for images in this project
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('rooms')
            .getPublicUrl(filePath)

          // Associate image with hotel
          // We'll try to update the primary image_url on the hotel for the first image
          if (index === 0) {
            await supabase
              .from('hotels')
              .update({ image_url: publicUrl })
              .eq('id', hotelId)
          }

          // Also insert into hotel_images if it exists, matching the room_images pattern
          // If it doesn't exist, we fallback gracefully to just the primary image_url
          const { error: galleryError } = await supabase
            .from('hotel_images')
            .insert({
              hotel_id: hotelId,
              image_url: publicUrl
            })

          if (galleryError) {
            console.warn("Could not insert into hotel_images, table might not exist:", galleryError.message)
          }

          return publicUrl
        })

        await Promise.all(uploadPromises)
      }

      // ✅ AUTO-REDIRECT TO ROOMS SETUP
      router.push(`/owner/dashboard/hotels/${hotelId}/rooms`)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create hotel')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !city || !address) {
      setError('Please fill in all required fields.')
      return
    }

    await handleCreateHotel()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Slow Panning & Zoom Animation */}
      <div className="absolute inset-0 z-0 scale-110 animate-[pan_30s_infinite_alternate]">
        <img
          src="https://i.pinimg.com/1200x/ba/85/cb/ba85cb57685f144d128878655360a91b.jpg"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes pan {
          0% { transform: scale(1) translateX(0); }
          50% { transform: scale(1.1) translateX(-2%); }
          100% { transform: scale(1) translateX(1%); }
        }
      `}</style>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-2xl px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mb-8 text-center sm:text-left transition-all">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center text-sm font-semibold text-white/60 hover:text-cyan-400 mb-6 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
            Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Business</span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg leading-relaxed font-medium">
            List your luxury property on StaySafe and reach thousands of premium guests today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group shadow-cyan-500/5"
        >
          {/* Enhanced Glow Effects to match Cyan/Emerald theme */}
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
                    className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500"
                    placeholder="Maldives"
                  />
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">
                Full Address
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-cyan-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-4 py-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500"
                  placeholder="Private Island, Atoll North..."
                />
              </div>
            </div>

            {/* Section: Details */}
            <div>
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
                  className="w-full rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 focus:border-cyan-500/40 focus:bg-white/10 pl-14 pr-5 py-5 text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500 resize-none"
                  placeholder="Tell the unique story of your property..."
                />
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
                    Add high-quality photos to attract premium guests
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">
                    {imageFiles.length} Images
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
                    <div className="text-sm font-black text-white/60 mb-1">Add Property Photos</div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed max-w-[140px]">
                      Select one or more professional shots
                    </p>
                  </div>
                </div>

                {/* Previews Grid */}
                <div className="grid grid-cols-2 gap-3 min-h-[120px]">
                  {imagePreviews.length === 0 ? (
                    <div className="col-span-2 flex items-center justify-center rounded-3xl bg-white/[0.01] border border-white/5 border-dashed p-4">
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] italic">
                        No images selected
                      </p>
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
              <div className="flex items-center gap-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-[1.5rem] p-5 animate-in fade-in zoom-in duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-5 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 hover:text-white border border-white/5 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black shadow-[0_12px_24px_-8px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] flex items-center justify-center min-w-[200px]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Launch Property'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}