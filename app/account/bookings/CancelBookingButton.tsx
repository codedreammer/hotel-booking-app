"use client"

import { cancelBooking } from "./actions"
import { useTransition } from "react"

interface CancelBookingButtonProps {
  bookingId: string
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleCancel = () => {
    const confirmed = confirm('Are you sure you want to cancel this booking? This action cannot be undone.')
    if (confirmed) {
      startTransition(() => {
        cancelBooking(bookingId)
      })
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:underline"
    >
      {isPending ? 'Cancelling...' : 'Cancel Booking'}
    </button>
  )
}