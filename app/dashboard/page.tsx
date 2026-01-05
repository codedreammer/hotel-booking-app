    import Link from "next/link"
    import LogoutButton from "@/components/LogoutButton"
    import { createServerClient } from "@supabase/ssr"
    import { cookies } from "next/headers"

    async function getUser() {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {},
          },
        }
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      return { ...user, role: profile?.role }
    }

    export default async function DashboardPage() {
      const user = await getUser()
      
    return (
        <div style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        <p>You are logged in successfully.</p>

        {user?.role === 'guest' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6 max-w-md">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Earn by hosting on our platform
            </h3>
            <p className="text-blue-700 mb-4">
              Add your hotel, manage bookings, and get paid securely.
            </p>
            <Link 
              href="/become-owner"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Start Hosting
            </Link>
          </div>
        )}

        <Link href="/hotels">
            <button style={{ marginTop: "1rem" }}>
            View Hotels
            </button>
        </Link>

        <LogoutButton />
        </div>
    )
    }
