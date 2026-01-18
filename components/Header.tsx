import Link from "next/link"

import LogoutButton from "@/components/LogoutButton"
import OwnerCTAButton from "@/components/OwnerCTAButton"

export default function Header({ user }: { user: any }) {
    return (
        <header className="relative z-10 w-full py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-3 group transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0 mr-6"
                    aria-label="StaySafe Home"
                >
                    <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 text-blue-600 drop-shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.172-2.613-.485-3.816a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.07-7.876-3.08zM10.97 11.47a.75.75 0 000 1.06l1.591 1.592a.75.75 0 001.06 0l4.242-4.243a.75.75 0 00-1.06-1.06L13.091 12.53l-1.06-1.06a.75.75 0 00-1.06 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">StaySafe</span>
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
                            <Link href="/account" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
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
