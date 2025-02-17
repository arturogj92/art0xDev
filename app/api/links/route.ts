// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("links")
        .select("*")
        .order("position", { ascending: true });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, url, image, visible, position, section_id } = body;

        const { data, error } = await supabaseAdmin
            .from("links")
            .insert([{ title, url, image, visible, position, section_id }])
            .select();
        if (error) throw error;

        return NextResponse.json(data?.[0], { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        if (Array.isArray(body)) {
            // Reordenar en masa
            const updates = body.map((l) =>
                supabaseAdmin.from("links").update({ position: l.position }).eq("id", l.id)
            );
            const results = await Promise.all(updates);
            const anyError = results.find((r) => r.error);
            if (anyError?.error) throw new Error(anyError.error.message);
            return NextResponse.json({ message: "Links reordered" }, { status: 200 });
        } else {
            // Update individual
            const { id, ...rest } = body;
            const { data, error } = await supabaseAdmin
                .from("links")
                .update(rest)
                .eq("id", id)
                .select();
            if (error) throw error;
            return NextResponse.json(data?.[0], { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const { error } = await supabaseAdmin.from("links").delete().eq("id", id);
        if (error) throw error;

        return NextResponse.json({ message: "Link deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
