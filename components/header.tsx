"use client";

import {CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import TypewriterText from "@/components/typewritertext/typewriter-text";

interface HeaderProps {
    name: string;
    role: string;
    description: string;
    profileImage: string;
}

export default function Header({ name, role, description, profileImage }: HeaderProps) {
    return (
        <CardContent className="mt-20 p-4 flex flex-col items-center text-center">
            <Avatar className="w-36 h-36">
                <AvatarImage src={profileImage} alt={name}/>
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h1 className="mt-4 text-3xl bg-gradient-to-l to-blue-600 from-green-300 font-bold text-transparent bg-clip-text">
                {name} · {role}
            </h1>

            <p
                className="
    mt-2
    text-xs       /* tamaño de fuente mínimo para pantallas muy pequeñas */
    sm:text-sm    /* en pantallas >= sm sube a text-sm */
    md:text-base  /* en pantallas >= md sube a text-base */
    text-white
    text-center
    break-words   /* fuerza a romper palabras si no caben */
    sm:max-w-[25rem]
    leading-tight /* reduce un poco el interlineado */
  "
            >
                <TypewriterText text={description}/>
            </p>

        </CardContent>
    );
}
