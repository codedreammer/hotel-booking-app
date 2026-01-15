'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type RoomImage = {
  id: string
  image_url: string
}

type Room = {
  id: string
  rooms_type: string
  price_per_night: number
  max_guests: number
  total_rooms: number
  is_active: boolean
  image_url: string | null
}

export default function EditRoomForm({
  room,
  hotelId,
  initialImages
}: {
  room: Room;
  hotelId: string;
  initialImages: RoomImage[]
}) {
  const router = useRouter()
  const [roomType, setRoomType] = useState(room.rooms_type)
  const [price, setPrice] = useState(room.price_per_night.toString())
  const [totalRooms, setTotalRooms] = useState(room.total_rooms.toString())
  const [maxGuests, setMaxGuests] = useState(room.max_guests.toString())
  const [isActive, setIsActive] = useState(room.is_active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [roomImages, setRoomImages] = useState<RoomImage[]>(initialImages)

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

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let finalImageUrl = room.image_url

      // If a new image is selected, we upload it
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

        finalImageUrl = publicUrl

        // Also insert into room_images table as requested by the user context
        const { error: imageInsertError } = await supabase
          .from('room_images')
          .insert({
            room_id: room.id,
            image_url: publicUrl
          })

        if (imageInsertError) console.error("Error inserting into room_images:", imageInsertError)
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          rooms_type: roomType,
          price_per_night: Number(price),
          total_rooms: Number(totalRooms),
          max_guests: Number(maxGuests),
          is_active: isActive,
          image_url: finalImageUrl
        })
        .eq('id', room.id)

      if (updateError) throw updateError

      router.push(`/owner/dashboard/hotels/${hotelId}/rooms`)
      router.refresh()
    } catch (err: any) {
      console.error("Critical Room Update Error:", err)
      setError(err.message || 'An error occurred while saving room details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
      {/* Left Column: Room Details Form */}
      <div className="lg:col-span-7 space-y-8">
        <form onSubmit={handleUpdateRoom} className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden transition-all duration-500 hover:border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <div>
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Room Details</h2>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Primary attributes & metadata</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center">
                  Room Name <span className="text-cyan-500 ml-1">*</span>
                </label>
                <input
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center">
                    Price per Night (₹) <span className="text-cyan-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center">
                    Max Guests <span className="text-cyan-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center">
                    Total Rooms in Inventory <span className="text-cyan-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center">
                    Listing Status
                  </label>
                  <div className="relative">
                    <select
                      value={isActive ? 'active' : 'inactive'}
                      onChange={(e) => setIsActive(e.target.value === 'active')}
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium appearance-none shadow-inner"
                    >
                      <option value="active" className="bg-zinc-900">Active Listing</option>
                      <option value="inactive" className="bg-zinc-900">Hidden / Maintenance</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
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

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-zinc-950 px-8 py-5 rounded-2xl font-black text-lg hover:bg-zinc-100 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href={`/owner/dashboard/hotels/${hotelId}/rooms`}
                className="px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-lg transition-all border border-white/5 text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* Right Column: Room Images Management */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Room Gallery</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                  {roomImages.length} images uploaded
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Image Upload Area */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
              <div className="aspect-video w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/10 group-hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center p-8 text-center overflow-hidden group-hover:bg-cyan-500/[0.02]">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="New preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <span className="text-xs font-black uppercase tracking-widest text-white px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-6 text-3xl shadow-inner group-hover:rotate-12 transition-transform duration-500 border border-white/5">
                      📸
                    </div>
                    <div className="text-sm font-black text-white mb-2">Upload Room Image</div>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest max-w-[180px] leading-relaxed">
                      Recommended: High-res square or 16:9 shots
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Images Grid */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2rem] text-white/30">Existing Visuals</h3>
              </div>

              {roomImages.length === 0 && !imagePreview ? (
                <div className="bg-white/5 border border-white/5 rounded-3xl p-10 text-center">
                  <p className="text-white/40 text-sm font-medium leading-relaxed italic">
                    "No images uploaded yet. Add photos to attract more guests."
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {roomImages.map((img) => (
                    <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                      <img
                        src={img.image_url}
                        alt="Room"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                  {imagePreview && (
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500 ring-4 ring-cyan-500/20 shadow-xl animate-pulse">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-cyan-600 rounded text-[8px] font-black uppercase tracking-tighter text-white">Pending</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pro Tip Card */}
        <div className="bg-gradient-to-br from-amber-600/10 to-transparent border border-amber-500/10 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shadow-inner border border-amber-500/10">
              💡
            </div>
            <div>
              <h4 className="text-amber-500 font-black text-sm uppercase tracking-widest mb-2">Optimization Tip</h4>
              <p className="text-white/40 text-xs font-medium leading-relaxed">
                Listings with more than 5 high-quality images see an average of 42% more clicks from potential guests. Make sure to capture different angles of the room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}