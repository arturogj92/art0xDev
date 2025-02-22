import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import {SignJWT} from "jose";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

export async function POST(request: Request) {
    try {
        const {email, password} = await request.json();
        if (!email || !password) {
            return NextResponse.json({message: "Faltan credenciales"}, {status: 400});
        }

        // Busca el admin con ese email
        const {data, error} = await supabase
            .from("admins")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error || !data) {
            return NextResponse.json({message: "Credenciales incorrectas"}, {status: 401});
        }

        // Compara la contraseña (plaintext) con el hash guardado
        const isPasswordValid = bcrypt.compareSync(password, data.password);
        if (!isPasswordValid) {
            return NextResponse.json({message: "Credenciales incorrectas"}, {status: 401});
        }

        // Genera token JWT
        const token = await new SignJWT({id: data.id, email: data.email})
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Devuelve JSON y setea cookie httpOnly
        const response = NextResponse.json({message: "Login exitoso", admin: data});
        response.cookies.set("adminAuthToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 horas
        });

        return response;
    } catch (err: unknown) {
        const errorObj = err instanceof Error ? err : new Error("Unknown error");
        return NextResponse.json(
            {message: "Error en el servidor", error: errorObj.message},
            {status: 500}
        );
    }
}
