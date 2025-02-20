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
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36">
                <AvatarImage src={profileImage} alt={name}/>
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h1
                className="
                    mt-4
                    text-xl
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

            <p
                className="
                    mt-2
                    text-xs
                    sm:text-sm
                    sm:text-base
                    text-white
                    text-center
                    break-words
                    sm:max-w-[25rem]
                    leading-tight
                "
            >
                {/* Aquí pasamos la prop text con un string */}
                <TypewriterText text={description}/>
            </p>
        </CardContent>
    );
}
