"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

export async function createRoom(formData: FormData) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const hotelId = formData.get("hotel_id") as string

  // Guard: Ensure hotelId is not undefined
  if (!hotelId) {
    throw new Error("Hotel ID is required")
  }

  // Log hotelId for debugging
  console.log('Creating room with hotelId:', hotelId)

  // 🔐 Ownership check (MANDATORY)
  const { data: hotel } = await supabase
    .from("hotels")
    .select("id")
    .eq("id", hotelId)
    .eq("owner_id", user.id)
    .single()

  if (!hotel) throw new Error("Unauthorized")

  // ✅ Create room
  const rooms_type = formData.get("rooms_type")
  const price_per_night = Number(formData.get("price_per_night"))
  const total_rooms = Number(formData.get("total_rooms"))
  const max_guests = Number(formData.get("max_guests"))

  const { error } = await supabase.from("rooms").insert({
    hotel_id: hotelId,
    rooms_type,
    price_per_night,
    total_rooms,
    max_guests,
  })

  if (error) {
    console.error('Supabase insert error:', error?.message, error)
    throw new Error(`Failed to create room: ${error.message}`)
  }

  redirect(`/owner/dashboard/hotels/${hotelId}/rooms`)
}