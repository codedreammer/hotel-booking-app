'use client'

import Link from 'next/link'
import { updateHotel } from './actions'

type Hotel = {
  id: string
  name: string
  city: string
  description: string | null
  star_rating: number | null
}

export default function EditHotelForm({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
      <div className="mb-6">
        <Link
          href={`/owner/dashboard/hotels/${hotel.id}`}
          className="text-blue-400 hover:text-blue-300 inline-block"
        >
          ← Back to Hotel
        </Link>
      </div>

      <form action={updateHotel.bind(null, hotel.id)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Hotel Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={hotel.name}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            defaultValue={hotel.city}
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={hotel.description || ''}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="star_rating" className="block text-sm font-medium mb-2">
            Star Rating
          </label>
          <select
            id="star_rating"
            name="star_rating"
            defaultValue={hotel.star_rating || ''}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium flex-1"
          >
            Update Hotel
          </button>
          <Link
            href={`/owner/dashboard/hotels/${hotel.id}`}
            className="bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-lg font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}