    'use client'

    import { useState } from 'react'
    import { supabase } from '@/lib/supabase/client'
    import { useRouter } from 'next/navigation'

    export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSignup = async () => {
        setError(null)
        const { error } = await supabase.auth.signUp({
        email,
        password
        })

        if (error) {
        setError(error.message)
        } else {
        router.push('/login')
        }
    }

    return (
        <div style={{ padding: 40 }}>
        <h1>Signup</h1>

        <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
        />
        <br /><br />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={handleSignup}>Signup</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
    }
