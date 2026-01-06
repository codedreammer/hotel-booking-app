import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EditHotelForm from './EditHotelForm'

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ hotelId: string }>
}) {
  const { hotelId } = await params
  const supabase = await getSupabaseServerClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    notFound()
  }

  const { data: hotel, error } = await supabase
    .from('hotels')
    .select('id, name, city, description, star_rating')
    .eq('id', hotelId)
    .single()

  if (error || !hotel) {
    console.error('Hotel fetch error:', error)
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-8">Edit Hotel</h1>
      <EditHotelForm hotel={hotel} />
    </div>
  )
}