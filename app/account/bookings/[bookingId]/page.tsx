import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ReceiptCard from "./ReceiptCard"
import PrintButton from "./PrintButton"
import CopyBookingId from "./CopyBookingId"
import CancelBookingButton from "../CancelBookingButton"

async function getBookingDetails(bookingId: string) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Use standard query with explicit foreign key for profiles
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      check_in,
      check_out,
      total_price,
      user_id,
      rooms (
        rooms_type,
        hotels (
          id,
          name,
          city,
          owner_id
        )
      ),
      profiles:profiles!bookings_user_id_fkey (
        full_name
      )
    `)
    .eq('id', bookingId)
    .single()

  if (error) {
    console.error('Booking details error:', error.message)
    return null
  }

  if (!booking) {
    return null
  }

  // Handle array/object difference for joined relations (Supabase might return arrays)
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms;
  const hotel = room && (Array.isArray(room.hotels) ? room.hotels[0] : room.hotels);
  const ownerId = hotel?.owner_id;

  const profile = Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles;

  // Authorization logic
  const isGuest = booking.user_id === user.id
  const isOwner = ownerId === user.id

  if (!isGuest && !isOwner) {
    return null
  }

  // Transform booking for usage in UI (flatten arrays)
  const safeBooking = {
    ...booking,
    rooms: {
      ...room,
      hotels: hotel
    },
    profiles: profile
  };

  return { booking: safeBooking, isGuest }
}

function BookingNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/account/bookings"
              className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Bookings
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            The booking you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/account/bookings"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Back to My Bookings
          </Link>
        </div>
      </main>
    </div>
  )
}

export default async function BookingDetailsPage({
  params
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const result = await getBookingDetails(bookingId)

  if (!result) {
    return <BookingNotFound />
  }

  const { booking, isGuest } = result
  const canCancel = isGuest && ['pending', 'confirmed'].includes(booking.status)

  return (
    <div className="min-h-screen bg-gray-50 print-white-bg">
      {/* Header - Hidden in print */}
      <header className="bg-white shadow-sm border-b border-gray-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/account/bookings"
              className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Bookings
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <ReceiptCard booking={booking} isGuest={isGuest} />

        {/* Actions */}
        <div className="mt-8 border-t border-gray-100 pt-8 no-print">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <PrintButton />
              <CopyBookingId bookingId={booking.id} />
            </div>
            {canCancel && (
              <CancelBookingButton bookingId={booking.id} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}