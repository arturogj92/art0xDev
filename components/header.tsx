"use client";

import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
                <AvatarImage src={profileImage} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h1 className="mt-4 text-3xl bg-gradient-to-l to-blue-600 from-green-300 font-bold text-transparent bg-clip-text">
                {name} · {role}
            </h1>

            {/* Aquí usamos Typewriter para animar la descripción */}
            {/*<p className="mt-2 text-1xl text-white text-center">*/}
                <TypewriterText text={description} />
            {/*</p>*/}
        </CardContent>
    );
}
