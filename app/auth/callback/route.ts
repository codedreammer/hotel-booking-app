import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  const user = session?.user

  if (!user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // 🔑 Ensure profile exists
  // We use upsert to create the profile if it doesn't exist, preventing "missing profile" UI issues.
  // We populate basic fields from the auth provider.
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    ''

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    ''

  // Attempt to create profile with all available data
  const profileData = {
    id: user.id,
    full_name: fullName,
    email: user.email,
    avatar_url: avatarUrl,
    role: 'guest',
  }

  // First try: Upsert with all fields
  let { error: profileError } = await supabase.from('profiles').upsert(
    profileData,
    { onConflict: 'id', ignoreDuplicates: true }
  )

  // Retry logic: If 'avatar_url' or 'email' column is missing, retry with safe subset
  if (profileError) {
    console.warn('Initial profile creation failed, retrying with minimal fields:', profileError.message)

    // Fallback 1: Exclude avatar_url (common schema mismatch)
    const { avatar_url, ...dataWithoutAvatar } = profileData
    const { error: retryError1 } = await supabase.from('profiles').upsert(
      dataWithoutAvatar,
      { onConflict: 'id', ignoreDuplicates: true }
    )

    if (retryError1) {
      // Fallback 2: Exclude email (rare but possible mismatch based on schema query)
      const { email, ...dataMinimal } = dataWithoutAvatar
      const { error: retryError2 } = await supabase.from('profiles').upsert(
        dataMinimal,
        { onConflict: 'id', ignoreDuplicates: true }
      )

      if (retryError2) {
        console.error('FINAL Profile creation failed:', retryError2)
      }
    }
  }

  // Fetch profile to check role for redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return NextResponse.redirect(
    profile?.role === 'owner'
      ? `${origin}/owner/dashboard`
      : `${origin}/`
  )
}