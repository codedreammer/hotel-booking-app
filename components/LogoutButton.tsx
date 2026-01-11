"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
    >
      Logout
    </button>
  )
}
