import Header from "@/components/Header";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import BookingForm from "./BookingForm";

async function getUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return { ...user, role: profile?.role };
}

export default async function NewBookingPage({
    searchParams,
}: {
    searchParams: Promise<{
        room_id?: string;
        check_in?: string;
        check_out?: string;
    }>;
}) {
    const params = await searchParams;
    const user = await getUser();

    const roomId = params.room_id;
    const checkIn = params.check_in;
    const checkOut = params.check_out;

    if (!roomId || !checkIn || !checkOut) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header user={user} />
                <div className="p-8 text-center text-red-500">
                    Invalid booking request. Missing parameters.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header user={user} />

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <BookingForm
                    roomId={roomId}
                    checkIn={checkIn}
                    checkOut={checkOut}
                />
            </main>
        </div>
    );
}
