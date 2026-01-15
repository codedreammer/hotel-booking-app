'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function AddRoomPage() {
  const router = useRouter()
  const params = useParams()
  const hotelId = params.hotelId as string

  const [roomType, setRoomType] = useState('')
  const [price, setPrice] = useState('')
  const [totalRooms, setTotalRooms] = useState('')
  const [maxGuests, setMaxGuests] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateRoom = async () => {
    setError(null)

    if (!hotelId) {
      setError('Hotel ID is missing.')
      return
    }

    if (!roomType || !price || !totalRooms || !maxGuests) {
      setError('All fields except image are required')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      let imageUrl = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${hotelId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('rooms')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('rooms')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const { error: insertError } = await supabase.from('rooms').insert({
        hotel_id: hotelId,
        rooms_type: roomType,
        price_per_night: Number(price),
        total_rooms: Number(totalRooms),
        max_guests: Number(maxGuests),
        image_url: imageUrl,
        is_active: true
      })

      if (insertError) throw insertError

      router.push(`/owner/dashboard/hotels/${hotelId}/rooms`)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link
            href={`/owner/dashboard/hotels/${hotelId}/rooms`}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2.5 group-hover:-translate-x-1 transition-transform text-cyan-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Rooms</span>
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
            Add New <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Room</span>
          </h1>
          <p className="text-white/40 text-lg font-medium">
            Define your room type, inventory, and add a welcoming image.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Room Type</label>
                  <input
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    placeholder="e.g. Presidential Suite"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Price per Night (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Max Guests</label>
                    <input
                      type="number"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      placeholder="2"
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1">Total Rooms in Inventory</label>
                  <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    placeholder="10"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm font-bold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full bg-white text-zinc-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-zinc-100 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : 'Launch Room Listing'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6">Room Image</label>

              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="aspect-square w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/10 group-hover:border-cyan-500/30 transition-all flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        📸
                      </div>
                      <div className="text-sm font-black text-white/60 mb-1">Upload Photo</div>
                      <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">JPG, PNG up to 5MB</div>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-6 text-sm text-white/30 font-medium leading-relaxed">
                Add a high-quality photo to significantly increase booking conversion rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}