import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import {verifyJwt} from "./lib/jwt";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Solo protegemos rutas que empiecen por /admin,
    // y excluimos /admin/login para no crear bucles
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = request.cookies.get("adminAuthToken")?.value;
        if (!token) {
            // No hay token => redirige a /admin/login
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Verifica token
        try {
            await verifyJwt(token);
            // Si no lanza error, pasa
            return NextResponse.next();
        } catch (err: unknown) {
            const errorObj = err instanceof Error ? err : new Error("Unknown error");
            return NextResponse.json(
                {message: 'Error en el servidor', error: errorObj.message},
                {status: 500}
            );
        }
    }

    return NextResponse.next();
}

// Config: indicamos que se aplique a /admin/(cualquier cosa)
export const config = {
    matcher: ["/admin/:path*"],
};
