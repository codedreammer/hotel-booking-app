import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { updateProfile } from "../actions"
import Header from "@/components/Header"

async function getUser() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, role')
    .eq('id', user.id)
    .single()

  return { ...user, ...profile }
}

function ProfileForm({ profile }: { profile: any }) {
  return (
    <form action={updateProfile} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name || ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={profile.phone || ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={profile.email || ''}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">Cannot be changed</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition"
        >
          Save Changes
        </button>
        <Link
          href="/account"
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 font-bold transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

export default async function ProfilePage() {
  const user = await getUser()

  const initials = user.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'G'

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header user={user} />

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Link href="/account" className="text-gray-500 hover:text-gray-900 font-medium">Account</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Profile</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Profile Header */}
          <div className="flex items-center mb-10 pb-10 border-b border-gray-100">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-6 shadow-lg shadow-blue-200">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {user.full_name || 'Guest'}
              </h1>
              <p className="text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <ProfileForm profile={user} />
        </div>
      </main>
    </div>
  )
}