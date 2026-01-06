import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { updateProfile } from "../actions"

async function getProfile() {
  const supabase = await getSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, role')
    .eq('id', user.id)
    .single()
    
  return { ...profile, email: user.email }
}

function ProfileForm({ profile }: { profile: any }) {
  return (
    <form action={updateProfile} className="space-y-6">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={profile.email || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"
          disabled
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Email cannot be changed
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={profile.phone || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
          placeholder="Optional"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Save Changes
        </button>
        <Link
          href="/account"
          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 font-medium"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

export default async function ProfilePage() {
  const profile = await getProfile()
  
  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'G'
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/account" className="text-xl font-semibold text-gray-900 dark:text-white">
              ← Back to Account
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.full_name || 'Guest'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <ProfileForm profile={profile} />
        </div>
      </main>
    </div>
  )
}