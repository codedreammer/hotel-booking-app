    'use client'

    import { useRouter } from 'next/navigation'
    import { supabase } from '@/lib/supabase/client'
    import { useState, useEffect } from 'react'
    import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics'

    export default function BecomeOwnerPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [checkingRole, setCheckingRole] = useState(true)

    useEffect(() => {
        const checkUserRole = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
            const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
            
            if (profile?.role === 'owner') {
            router.push('/owner/dashboard')
            return
            }
        }
        
        setCheckingRole(false)
        }
        
        checkUserRole()
    }, [router])

    const handleStartHosting = async () => {
        setError(null)
        setLoading(true)

        const {
        data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
        router.push('/login?next=/become-owner')
        return
        }

        const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'owner' })
        .eq('id', user.id)

        if (updateError) {
        setError('Unable to upgrade account. Please try again.')
        setLoading(false)
        return
        }

        // Track successful owner upgrade
        trackEvent(ANALYTICS_EVENTS.OWNER_UPGRADE_COMPLETED, {
        userId: user.id,
        timestamp: new Date().toISOString()
        })

        router.push('/owner/dashboard')
    }

    if (checkingRole) {
        return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
            <p>Loading...</p>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Start Hosting on Our Platform
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            List your hotel, manage bookings, and earn with full control — all from one dashboard.
            </p>
        </section>

        {/* BENEFITS */}
        <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 mb-20">
            <BenefitCard
            title="Manage Bookings"
            description="Confirm, check-in, and manage guest stays effortlessly."
            icon="🧾"
            />
            <BenefitCard
            title="Secure Payments"
            description="Receive payments securely with full transparency."
            icon="💳"
            />
            <BenefitCard
            title="Analytics & Control"
            description="Track occupancy, revenue, and performance in real time."
            icon="📊"
            />
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
            <h2 className="text-2xl font-semibold text-center mb-10">
            How It Works
            </h2>
            <div className="space-y-4">
            <Step number="1" text="Activate owner access" />
            <Step number="2" text="Add your hotel details" />
            <Step number="3" text="List rooms & pricing" />
            <Step number="4" text="Start receiving bookings" />
            </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
            <h2 className="text-2xl font-semibold text-center mb-8">
            Requirements
            </h2>
            <ul className="space-y-3 text-gray-300 text-center">
            <li>✔ Verified email address</li>
            <li>✔ Hotel ownership or authorization</li>
            <li>✔ Compliance with platform policies</li>
            <li>✔ Payment setup (Stripe)</li>
            </ul>
        </section>

        {/* CTA */}
        <section className="max-w-xl mx-auto px-6 pb-24 text-center">
            {error && (
            <p className="mb-4 text-red-500 text-sm">{error}</p>
            )}

            <button
            onClick={handleStartHosting}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl transition-all"
            >
            {loading ? 'Activating…' : '🚀 Start Hosting'}
            </button>

            <p className="mt-6 text-gray-400 text-sm">
            Not ready yet?{' '}
            <a href="/" className="text-blue-500 hover:underline">
                Continue browsing as a guest
            </a>
            </p>
        </section>
        </div>
    )
    }

    /* ------------------ Components ------------------ */

    function BenefitCard({
    title,
    description,
    icon,
    }: {
    title: string
    description: string
    icon: string
    }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-600 transition">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        </div>
    )
    }

    function Step({ number, text }: { number: string; text: string }) {
    return (
        <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {number}
        </div>
        <p className="text-gray-300">{text}</p>
        </div>
    )
    }
