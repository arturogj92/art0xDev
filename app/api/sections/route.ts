// app/api/sections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from("sections")
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
        const { title, position } = body;
        const { data, error } = await supabaseAdmin
            .from("sections")
            .insert([{ title, position }])
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
            const updates = body.map((sec) =>
                supabaseAdmin.from("sections").update({ position: sec.position }).eq("id", sec.id)
            );
            const results = await Promise.all(updates);
            const anyError = results.find((r) => r.error);
            if (anyError?.error) throw new Error(anyError.error.message);
            return NextResponse.json({ message: "Sections reordered" }, { status: 200 });
        } else {
            // Update individual
            const { id, ...rest } = body;
            const { data, error } = await supabaseAdmin
                .from("sections")
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
        const { error } = await supabaseAdmin.from("sections").delete().eq("id", id);
        if (error) throw error;

        return NextResponse.json({ message: "Section deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
