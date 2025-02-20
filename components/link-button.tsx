"use client";

import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";

interface LinkButtonProps {
    title: string;
    url: string;
    iconUrl: string;
    index: number;
}

export default function LinkButton({title, url, iconUrl, index}: LinkButtonProps) {
    return (
        <Link href={url} legacyBehavior>
            <a
                className="block w-full max-w-[650px] mx-auto my-2 hover:scale-100 hover:animate-spin"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Button variant="outline" className={`
                    w-full 
                    h-auto 
                    p-0 
                    duration-300 
                    transition-transform 
                    hover:scale-105 
                                  ${
                    // Solo al primer enlace le damos un estilo extra:
                    index === 0
                        ? "shadow-[0_0_24px_3px_#67096b]"
                        : ""
                }
                `}>
                    <div className="grid grid-cols-[64px_1fr] gap-2 items-center w-full">
                        <div className="relative w-16 h-16 bg-gray-200">
                            <Image src={iconUrl} alt="Icono" fill className="object-cover "/>
                        </div>
                        <span className="break-words whitespace-normal p-2 text-sm md:text-base">
              {title}
            </span>
                    </div>
                </Button>
            </a>
        </Link>
    );
}
