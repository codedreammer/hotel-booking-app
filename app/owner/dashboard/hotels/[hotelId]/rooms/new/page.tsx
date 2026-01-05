'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

  const handleCreateRoom = async () => {
    setError(null)

    // Guard: Check if hotelId is missing
    if (!hotelId) {
      setError('Hotel ID is missing. Please navigate back and try again.')
      return
    }

    if (!roomType || !price || !totalRooms || !maxGuests) {
      setError('All fields are required')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Unauthorized')
      setLoading(false)
      return
    }

    // Log hotelId for debugging
    console.log('Creating room with hotelId:', hotelId)

    const { error: insertError } = await supabase.from('rooms').insert({
      hotel_id: hotelId,
      rooms_type: roomType,
      price_per_night: Number(price),
      total_rooms: Number(totalRooms),
      max_guests: Number(maxGuests),
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError?.message, insertError)
      setError(`Failed to create room: ${insertError.message}`)
      setLoading(false)
      return
    }

    router.push(`/owner/dashboard/hotels/${hotelId}/rooms`)
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-2">Add a new room</h1>
      <p className="text-gray-400 mb-8">
        Define room type, pricing, and capacity.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <input
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          placeholder="Room type (e.g. Deluxe, Suite)"
          className="w-full bg-zinc-800 p-3 rounded"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night"
          className="w-full bg-zinc-800 p-3 rounded"
        />

        <input
          type="number"
          value={totalRooms}
          onChange={(e) => setTotalRooms(e.target.value)}
          placeholder="Total rooms available"
          className="w-full bg-zinc-800 p-3 rounded"
        />

        <input
          type="number"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          placeholder="Max guests per room"
          className="w-full bg-zinc-800 p-3 rounded"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleCreateRoom}
          disabled={loading || !hotelId}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Room'}
        </button>
      </div>
    </div>
  )
}