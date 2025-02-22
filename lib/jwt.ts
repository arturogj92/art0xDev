import {jwtVerify} from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyJwt(token: string) {
    const {payload} = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
    );
    return payload; // si no lanza error => es válido
}
