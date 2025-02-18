// app/api/images/route.ts
import {NextRequest, NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase"; // Ajusta la ruta

export async function POST(req: NextRequest) {
    try {
        const {base64} = await req.json();  // la parte pura
        if (!base64) {
            throw new Error("No se recibió base64");
        }

        // Convertir a buffer
        const buffer = Buffer.from(base64, "base64");

        // Generar un nombre de archivo único (p.ej. con un timestamp)
        const fileName = `image-${Date.now()}.png`;  // o .jpg, etc.

        // Subir a Supabase Storage => bucket "images" (ajusta a tu gusto)
        const {data, error} = await supabaseAdmin.storage
            .from("images")              // nombre del bucket
            .upload(fileName, buffer, {
                contentType: "image/png",  // ajusta a la extensión real
            });
        if (error) {
            throw new Error(error.message);
        }

        // Generar URL pública => getPublicUrl
        const {data: publicData} = supabaseAdmin.storage
            .from("images")
            .getPublicUrl(fileName);

        const publicUrl = publicData?.publicUrl;
        if (!publicUrl) {
            throw new Error("No se pudo obtener la URL pública");
        }

        // Retornar la URL al cliente
        return NextResponse.json({url: publicUrl});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
