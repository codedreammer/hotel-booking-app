import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import ProfilePanel from "./ProfilePanel"
import Image from "next/image"

async function getUser() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role')
    .eq('id', user.id)
    .single()

  // Use avatar_url from user_metadata (from Google or previous updates)
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

  return { ...user, ...profile, avatar_url: avatarUrl }
}

export default async function ProfilePage() {
  const user = await getUser()

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-[#0a0a0b]">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://i.pinimg.com/1200x/52/46/7e/52467e0e56de0c4040032e285a444bc5.jpg"
          alt="Background"
          fill
          className="object-cover opacity-60 scale-110"
          priority
        />
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-[#1d4ed8]/20 mix-blend-multiply animate-pulse-slow" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <Header user={user} />

      <main className="relative z-10 max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-10 flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <Link href="/account" className="text-white/60 hover:text-white font-bold text-sm transition-colors uppercase tracking-widest">Account</Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/20">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-black text-sm uppercase tracking-widest">Profile Upgrade</span>
        </div>

        {/* The Card */}
        <ProfilePanel profile={user} />

        {/* Performance Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            Secure Profile Management System v2.0
          </p>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
      `}} />
    </div>
  )
}