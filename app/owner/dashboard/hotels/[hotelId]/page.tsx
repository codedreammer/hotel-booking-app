'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Hotel = {
  id: string
  name: string
  city: string
  description: string | null
}

export default function HotelOverviewPage() {
  const params = useParams()
  const hotelId = params.hotelId as string

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotel = async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city, description')
        .eq('id', hotelId)
        .single()

      if (!error && data) {
        setHotel(data)
      }

      setLoading(false)
    }

    fetchHotel()
  }, [hotelId])

  if (loading) {
    return <p className="p-6 text-gray-400">Loading hotel...</p>
  }

  if (!hotel) {
    return <p className="p-6 text-red-400">Hotel not found</p>
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-8">
        <Link
          href="/owner/dashboard/hotels"
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Hotels
        </Link>
        <h1 className="text-3xl font-semibold mb-2">{hotel.name}</h1>
        <p className="text-gray-400 text-lg">{hotel.city}</p>
        {hotel.description && (
          <p className="text-gray-300 mt-4">{hotel.description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/owner/dashboard/hotels/${hotelId}/rooms`}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 dark:text-purple-400 text-xl">🛏️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Manage Rooms</h3>
            <p className="text-gray-400 text-sm">
              Add, edit, and manage room types and pricing
            </p>
          </div>
        </Link>

        <Link
          href={`/owner/dashboard/hotels/${hotelId}/bookings`}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 transition-colors"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 dark:text-orange-400 text-xl">📅</span>
            </div>
            <h3 className="text-lg font-medium mb-2">View Bookings</h3>
            <p className="text-gray-400 text-sm">
              View and manage hotel reservations
            </p>
          </div>
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 opacity-50">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-600 dark:text-gray-400 text-xl">⚙️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Edit Hotel</h3>
            <p className="text-gray-400 text-sm">
              Update hotel information (Coming soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}