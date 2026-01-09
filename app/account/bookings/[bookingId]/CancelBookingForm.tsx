"use client"

import { cancelBookingAndRedirect } from "./actions"
import { useTransition } from "react"

interface CancelBookingFormProps {
  bookingId: string
}

export default function CancelBookingForm({ bookingId }: CancelBookingFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    const confirmed = confirm('Are you sure you want to cancel this booking? This action cannot be undone.')
    if (confirmed) {
      startTransition(() => {
        cancelBookingAndRedirect(bookingId)
      })
    }
  }

  return (
    <form action={handleSubmit}>
      <button
        type="submit"
        disabled={isPending}
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Cancelling...' : 'Cancel Booking'}
      </button>
    </form>
  )
}