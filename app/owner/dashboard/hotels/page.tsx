'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Hotel = {
  id: string
  name: string
  city: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, city')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setHotels(data)
      }

      setLoading(false)
    }

    fetchHotels()
  }, [])

  if (loading) {
    return <p className="p-6 text-gray-400">Loading hotels...</p>
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Hotels</h1>
          <p className="text-gray-400">Manage your hotel properties</p>
        </div>
        <Link
          href="/owner/dashboard/hotels/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
        >
          Add New Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
          <p className="text-lg font-medium mb-2">No hotels yet</p>
          <p className="text-gray-400 mb-6">
            Add your first hotel to start managing rooms and bookings.
          </p>
          <Link
            href="/owner/dashboard/hotels/new"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium"
          >
            Add your first hotel
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                <p className="text-gray-400">{hotel.city}</p>
              </div>
              <Link
                href={`/owner/dashboard/hotels/${hotel.id}`}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}