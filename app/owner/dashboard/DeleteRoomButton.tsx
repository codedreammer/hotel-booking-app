"use client"

import { useState, useTransition } from "react"
import { deleteRoom } from "./actions"
import { useRouter } from "next/navigation"

export default function DeleteRoomButton({ roomId }: { roomId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteRoom(roomId)

      if (res?.error) {
        alert(res.error)
        return
      }

      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}