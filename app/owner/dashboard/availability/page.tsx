import { getAvailabilityData } from "./action";
import Calendar from "./Calender";
import AvailabilityBackground from "@/components/AvailabilityBackground";
import Link from "next/link";

export default async function AvailabilityPage() {
    const data = await getAvailabilityData(14);

    return (
        <div className="relative min-h-screen">
            <AvailabilityBackground />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link
                            href="/owner/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                            Back to Dashboard
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Availability</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400 font-medium">View and manage room availability by date</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-800/20 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <span className="text-gray-600 dark:text-gray-300">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                            <span className="text-gray-600 dark:text-gray-300">Partially</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                            <span className="text-gray-600 dark:text-gray-300">Fully Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <span className="text-gray-600 dark:text-gray-300">Past</span>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-[2px]">
                    <Calendar data={data} />
                </div>
            </div>
        </div>
    );
}
