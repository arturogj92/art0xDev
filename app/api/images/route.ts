// app/api/images/route.ts
import {NextRequest, NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase"; // Ajusta la ruta si difiere

// POST => subir imagen
export async function POST(req: NextRequest) {
    try {
        const {base64} = await req.json();
        if (!base64) {
            throw new Error("No se recibió base64");
        }

        // Convertir a buffer
        const buffer = Buffer.from(base64, "base64");

        // Nombre único
        const fileName = `image-${Date.now()}.png`; // Ajusta la extensión si usas JPG, etc.

        // Subir al bucket "images"
        const {error} = await supabaseAdmin.storage
            .from("images")
            .upload(fileName, buffer, {
                contentType: "image/png", // Ajusta a la extensión real
            });
        if (error) {
            throw new Error(error.message);
        }

        // Obtener URL pública
        const {data: publicData} = supabaseAdmin.storage
            .from("images")
            .getPublicUrl(fileName);

        const publicUrl = publicData?.publicUrl;
        if (!publicUrl) {
            throw new Error("No se pudo obtener la URL pública");
        }

        // Devolvemos también el fileName por si quieres guardarlo
        return NextResponse.json({url: publicUrl, fileName}, {status: 201});
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: 'Error en el servidor', error: errorObj.message},
            {status: 500}
        );
    }
}

// DELETE => borrar imagen del bucket
export async function DELETE(req: NextRequest) {
    try {
        // Leer ?fileName=...
        const {searchParams} = new URL(req.url);
        const fileName = searchParams.get("fileName");
        if (!fileName) {
            throw new Error("No se proporcionó fileName");
        }


        // Eliminar del bucket "images"
        const {error} = await supabaseAdmin.storage
            .from("images")
            .remove([fileName]);
        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({success: true}, {status: 200});
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: 'Error en el servidor', error: errorObj.message},
            {status: 500}
        );
    }
}
