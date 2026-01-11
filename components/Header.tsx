import Link from "next/link"
import LogoutButton from "@/components/LogoutButton"
import OwnerCTAButton from "@/components/OwnerCTAButton"

export default function Header({ user }: { user: any }) {
    return (
        <header className="relative z-10 w-full py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-1.5 rounded-md group-hover:bg-blue-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight ml-1">StaySafe</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <Link href="/hotels" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Search Hotels</Link>

                    {!user ? (
                        <>
                            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/account" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                My Account
                            </Link>
                            {user.role === 'owner' ? (
                                <Link href="/owner/dashboard" className="text-blue-600 font-semibold hover:underline">
                                    Owner Dashboard
                                </Link>
                            ) : (
                                <OwnerCTAButton />
                            )}
                            <LogoutButton />
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
