'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function HotelBookingsPage() {
  const params = useParams()
  const hotelId = params.hotelId as string

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-8">
        <Link
          href={`/owner/dashboard/hotels/${hotelId}`}
          className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
        >
          ← Back to Hotel Overview
        </Link>
        <h1 className="text-3xl font-semibold mb-2">Hotel Bookings</h1>
        <p className="text-gray-400">View and manage bookings for this hotel</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
        <p className="text-lg font-medium mb-2">Bookings Management</p>
        <p className="text-gray-400 mb-6">
          Hotel-specific bookings management will be implemented here.
        </p>
      </div>
    </div>
  )
}