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

export default function Header({
                                   name,
                                   role,
                                   description,
                                   profileImage,
                               }: HeaderProps) {
    return (
        <CardContent className="mt-10 p-4 flex flex-col items-center text-center">
            {/* Avatar con tamaños distintos en breakpoints */}
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36">
                <AvatarImage src={profileImage} alt={name}/>
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Nombre y rol más pequeños en pantallas muy pequeñas */}
            <h1
                className="
          mt-4
          text-xl           /* por defecto, pantallas muy pequeñas */
          sm:text-2xl
          md:text-3xl
          bg-gradient-to-tr
          from-green-200
          to-blue-400
          font-bold
          text-transparent
          bg-clip-text
        "
            >
                {name} · {role}
            </h1>

            {/* Descripción con tipografías escalonadas */}
            <p
                className="
    mt-2
    text-xs       /* tamaño de fuente mínimo para pantallas muy pequeñas */
    sm:text-sm    /* en pantallas >= sm sube a text-sm */
    sm:text-base  /* en pantallas >= md sube a text-base */
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
