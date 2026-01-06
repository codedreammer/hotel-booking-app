'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateHotel(hotelId: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const description = formData.get('description') as string
  const star_rating = parseInt(formData.get('star_rating') as string)

  // Update hotel - RLS will ensure only owner can update
  const { error } = await supabase
    .from('hotels')
    .update({
      name,
      city,
      description: description || null,
      star_rating: star_rating || null,
    })
    .eq('id', hotelId)

  if (error) {
    throw new Error('Failed to update hotel')
  }

  revalidatePath(`/owner/dashboard/hotels/${hotelId}`)
  redirect(`/owner/dashboard/hotels/${hotelId}`)
}