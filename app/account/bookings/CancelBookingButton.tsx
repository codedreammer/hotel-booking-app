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
      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Cancelling...' : 'Cancel Booking'}
    </button>
  )
}