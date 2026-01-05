'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type Room = {
  id: string
  rooms_type: string
  price_per_night: number
  total_rooms: number
  max_guests: number
  is_active: boolean
}

export default function RoomsPage() {
  const params = useParams()
  const hotelId = params.hotelId as string

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setRooms(data)
      }

      setLoading(false)
    }

    fetchRooms()
  }, [hotelId])

  if (loading) {
    return <p className="p-6 text-gray-400">Loading rooms...</p>
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Rooms</h1>
          <p className="text-gray-400">
            Manage room types, pricing, and capacity.
          </p>
        </div>

        <Link
          href={`/owner/dashboard/hotels/${hotelId}/rooms/new`}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
        >
          Add New Room
        </Link>
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
          <p className="text-lg font-medium mb-2">No rooms added yet</p>
          <p className="text-gray-400 mb-6">
            Add your first room to start receiving bookings.
          </p>

          <Link
            href={`/owner/dashboard/hotels/${hotelId}/rooms/new`}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-medium"
          >
            Add Your First Room
          </Link>
        </div>
      ) : (
        /* Rooms Table */
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-800 text-gray-300 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Room Type</th>
                <th className="text-left px-4 py-3">Price / Night</th>
                <th className="text-left px-4 py-3">Capacity</th>
                <th className="text-left px-4 py-3">Total Rooms</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {room.rooms_type}
                  </td>
                  <td className="px-4 py-3">
                    ₹{room.price_per_night}
                  </td>
                  <td className="px-4 py-3">
                    {room.max_guests} guests
                  </td>
                  <td className="px-4 py-3">
                    {room.total_rooms}
                  </td>
                  <td className="px-4 py-3">
                    {room.is_active ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}