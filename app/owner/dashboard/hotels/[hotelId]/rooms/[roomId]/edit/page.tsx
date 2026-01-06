import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EditRoomForm from './EditRoomForm'

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
    .select('id, rooms_type, price_per_night, max_guests, total_rooms, is_active')
    .eq('id', roomId)
    .single()

  if (error || !room) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-8">Edit Room</h1>
      <EditRoomForm room={room} hotelId={hotelId} />
    </div>
  )
}