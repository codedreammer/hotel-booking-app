'use client'

import Link from 'next/link'
import { updateRoom } from './actions'

type Room = {
  id: string
  rooms_type: string
  price_per_night: number
  max_guests: number
  total_rooms: number
  is_active: boolean
}

export default function EditRoomForm({ room, hotelId }: { room: Room; hotelId: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
      <div className="mb-6">
        <Link
          href={`/owner/dashboard/hotels/${hotelId}/rooms`}
          className="text-blue-400 hover:text-blue-300 inline-block"
        >
          ← Back to Rooms
        </Link>
      </div>

      <form action={updateRoom.bind(null, room.id, hotelId)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Room Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={room.rooms_type}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="price_per_night" className="block text-sm font-medium mb-2">
            Price per Night *
          </label>
          <input
            type="number"
            id="price_per_night"
            name="price_per_night"
            defaultValue={room.price_per_night}
            min="0"
            step="0.01"
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium mb-2">
            Capacity (Max Guests) *
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            defaultValue={room.max_guests}
            min="1"
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="total_rooms" className="block text-sm font-medium mb-2">
            Total Rooms *
          </label>
          <input
            type="number"
            id="total_rooms"
            name="total_rooms"
            defaultValue={room.total_rooms}
            min="1"
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={room.is_active ? 'active' : 'inactive'}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex-1"
          >
            Save Changes
          </button>
          <Link
            href={`/owner/dashboard/hotels/${hotelId}/rooms`}
            className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-lg font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}