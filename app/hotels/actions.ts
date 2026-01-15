"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getSupabase() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
}

export async function getHotelsByCity(city: string) {
    const supabase = await getSupabase();

    const { data, error } = await supabase
        .from("hotels")
        .select("id, name, city, description, star_rating, image_url")
        .ilike("city", `%${city}%`)
        .order("name");

    if (error) throw error;

    return data;
}
