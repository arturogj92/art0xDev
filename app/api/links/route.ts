// app/api/links/route.ts
import {NextRequest, NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase";

// GET: obtener lista de enlaces ordenados
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

// POST: crear un nuevo enlace
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
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: 'Error en el servidor', error: errorObj.message},
            {status: 500}
        );
    }
}

// PATCH: reordenar en masa O actualizar un enlace individual
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        // Si recibimos un array => updates masivos (ej. reordenar, reasignar section_id, etc.)
        if (Array.isArray(body)) {
            // Hacemos un Promise.all para procesar cada item
            const results = await Promise.all(
                body.map((item) =>
                    supabaseAdmin
                        .from("links")
                        .update(item)       // <-- Aquí usamos todo el objeto, para que "section_id: null" se aplique
                        .eq("id", item.id)
                        .select()
                )
            );
            // Ver si hay algún error
            const anyError = results.find((r) => r.error);
            if (anyError?.error) throw new Error(anyError.error.message);

            // Recopilamos la data actualizada
            const allData = results.flatMap((r) => r.data ?? []);
            return NextResponse.json(allData, {status: 200});
        } else {
            // PATCH individual
            const { id, ...rest } = body;
            if (!id) {
                return NextResponse.json({error: "No ID provided"}, {status: 400});
            }

            // Actualizamos el enlace con los campos que nos lleguen (title, url, section_id, etc.)
            const { data, error } = await supabaseAdmin
                .from("links")
                .update(rest)
                .eq("id", id)
                .select();
            if (error) throw error;

            return NextResponse.json(data?.[0], { status: 200 });
        }
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: 'Error en el servidor', error: errorObj.message},
            {status: 500}
        );
    }
}

// DELETE: borrar un enlace
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const {error} = await supabaseAdmin
            .from("links")
            .delete()
            .eq("id", id);
        if (error) throw error;

        return NextResponse.json({ message: "Link deleted" }, { status: 200 });
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: 'Error en el servidor', error: errorObj.message},
            {status: 500}
        );
    }
}
