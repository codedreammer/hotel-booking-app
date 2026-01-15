import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EditRoomForm from './EditRoomForm'
import Link from 'next/link'

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ hotelId: string; roomId: string }>
}) {
  const { hotelId, roomId } = await params
  const supabase = await getSupabaseServerClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    notFound()
  }

  const { data: room, error } = await supabase
    .from('rooms')
    .select('id, rooms_type, price_per_night, max_guests, total_rooms, is_active, image_url')
    .eq('id', roomId)
    .single()

  const { data: images } = await supabase
    .from('room_images')
    .select('*')
    .eq('room_id', roomId)

  if (error || !room) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Room Details</span>
          </h1>
          <p className="text-white/40 text-lg font-medium">
            Refine pricing, capacity, and manage your property's visual gallery.
          </p>
        </div>

        <EditRoomForm room={room} hotelId={hotelId} initialImages={images || []} />
      </div>
    </div>
  )
}