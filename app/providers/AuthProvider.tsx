    "use client"

    import { useEffect, useState } from "react"
    import { supabase } from "@/lib/supabase/client"

    export default function AuthProvider({
    children,
    }: {
    children: React.ReactNode
    }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(() => {
        setLoading(false)
        })
    }, [])

    if (loading) {
        return <p>Loading session...</p>
    }

    return <>{children}</>
    }
