import BookingsList from "@/components/BookingsList"
import { getBookings } from "@/lib/bookings"

export default async function BookingsPage() {
  const bookings = await getBookings()
  
  return (
    <BookingsList 
      bookings={bookings}
      showBackButton={true}
      backHref="/"
      backText="Back to Home"
    />
  )
}
