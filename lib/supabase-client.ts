"use client";

import {createClient} from "@supabase/supabase-js";

// Estos deben ser variables PÚBLICAS (NEXT_PUBLIC_...):
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Este cliente se usa en el navegador (React).
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // o false, depende de tu preferencia
    },
});
