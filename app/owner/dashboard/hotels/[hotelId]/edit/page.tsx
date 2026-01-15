import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import EditHotelForm from './EditHotelForm'
import Link from 'next/link'

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
    .select('id, name, city, description, star_rating, image_url')
    .eq('id', hotelId)
    .single()

  if (error || !hotel) {
    console.error('Hotel fetch error:', error)
    notFound()
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


      {/* Form Content */}
      <div className="relative z-10 w-full max-w-2xl px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="mb-8 text-center sm:text-left transition-all">
          <Link
            href={`/owner/dashboard/hotels/${hotel.id}`}
            className="inline-flex items-center text-sm font-semibold text-white/60 hover:text-cyan-400 mb-6 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Hotel Details
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
            Refine Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Listing</span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg leading-relaxed font-medium">
            Keep your property information current to attract more high-value guests.
          </p>
        </div>

        <EditHotelForm hotel={hotel} />
      </div>
    </div>
  )
}