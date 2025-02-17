import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // Ajusta la ruta a tu helper

// GET => obtener lista
export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("social_links")
        .select("*")
        .order("position", { ascending: true });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
}

// POST => crear
export async function POST(request: Request) {
    const body = await request.json();
    // { name, url, visible, position? }
    const { data, error } = await supabaseAdmin
        .from("social_links")
        .insert({
            name: body.name,
            url: body.url,
            visible: body.visible,
            position: body.position ?? 0,
        })
        .select("*")
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
}

// PATCH => reorden masivo (con multiple updates)
export async function PATCH(request: Request) {
    const body = await request.json();

    if (Array.isArray(body)) {
        // Reorden masivo
        for (const item of body) {
            // item: { id, position }
            const { error } = await supabaseAdmin
                .from("social_links")
                .update({ position: item.position })
                .eq("id", item.id);
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ success: true });
    } else {
        // update individual (como antes)
        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json({ error: "No ID provided" }, { status: 400 });
        }
        const { data, error } = await supabaseAdmin
            .from("social_links")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(data);
    }
}
