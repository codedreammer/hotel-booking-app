'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateRoom(roomId: string, hotelId: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const name = formData.get('name') as string
  const price_per_night = parseFloat(formData.get('price_per_night') as string)
  const capacity = parseInt(formData.get('capacity') as string)
  const total_rooms = parseInt(formData.get('total_rooms') as string)
  const status = formData.get('status') as string

  // Update room - RLS will ensure only owner can update
  const { error } = await supabase
    .from('rooms')
    .update({
      rooms_type: name,
      price_per_night,
      max_guests: capacity,
      total_rooms,
      is_active: status === 'active',
    })
    .eq('id', roomId)

  if (error) {
    throw new Error('Failed to update room')
  }

  revalidatePath(`/owner/dashboard/hotels/${hotelId}/rooms`)
  redirect(`/owner/dashboard/hotels/${hotelId}/rooms`)
}