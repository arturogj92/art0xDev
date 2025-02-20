"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React from "react";
import {SocialLinkData} from "./types";
import {Toggle} from "@/components/ui/toggle";
import {Input} from "@/components/ui/input";
import {FaGithub, FaInstagram, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube,} from "react-icons/fa6";

function HandleIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 25 25"
            fill="none"
            stroke="white"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
                fill="#121923"
            />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223C5.75 5.546 8.473 3.75 12
           3.75s6.25 1.796 8.02 4.473a12.082
           12.082 0 0 1 1.845 3.152.75.75 0
           0 1 0 .75c-.47 1.016-1.1 1.996-1.845
           3.152C18.25 18.454 15.527 20.25 12
           20.25s-6.25-1.796-8.02-4.473a12.082
           12.082 0 0 1-1.845-3.152.75.75
           0 0 1 0-.75 12.082 12.082 0 0
           1 1.845-3.152z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1
           1-6 0 3 3 0 0 1 6 0z"
            />
        </svg>
    );
}

function EyeSlashIcon() {
    return (
        <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223C5.75 5.546
           8.473 3.75 12 3.75c1.467 0 2.84.254
           4.084.718M20.02 8.223c.745 1.156
           1.375 2.136 1.845 3.152a.75.75
           0 0 1 0 .75 12.082 12.082 0
           0 1-1.845 3.152c-1.77 2.677-4.493
           4.473-8.02 4.473-1.45 0-2.82-.25-4.06-.708M9.53
           9.53l4.94 4.94M9.53 14.47l4.94-4.94"
            />
        </svg>
    );
}

function getSocialIcon(name: string) {
    switch (name) {
        case "instagram":
            return <FaInstagram className="text-2xl"/>;
        case "twitter":
            return <FaXTwitter className="text-2xl"/>;
        case "youtube":
            return <FaYoutube className="text-2xl"/>;
        case "tiktok":
            return <FaTiktok className="text-2xl"/>;
        case "github":
            return <FaGithub className="text-2xl"/>;
        case "linkedin":
            return <FaLinkedin className="text-2xl"/>;
        default:
            return null;
    }
}

// Ajusta la interfaz para recibir la callback de update
interface SortableSocialItemProps {
    social: SocialLinkData;
    onUpdate: (id: string, updates: Partial<SocialLinkData>) => void;
}

export function SortableSocialItem({social, onUpdate}: SortableSocialItemProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({id: social.id}); // sin setActivatorNodeRef

    // Estilos para la animación de arrastre
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "rgba(128,90,213,0.3)" : "transparent",
    };

    // Para el Toggle
    function toggleVisible(pressed: boolean) {
        onUpdate(social.id, {visible: pressed});
    }

    function handleUrlChange(newUrl: string) {
        onUpdate(social.id, {url: newUrl});
    }

    const Icon = getSocialIcon(social.name);

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="
        relative
        border border-gray-500
        p-4
        rounded-2xl
        bg-black
        text-white
        min-h-[5rem]
      "
        >
            {/* HANDLE => top-left (usa attributes + listeners) */}
            <div
                className="
          absolute
          top-2
          left-2
          cursor-grab
          px-2
          text-sm
          text-white
          rounded
        "
                {...attributes}
                {...listeners}
            >
                <HandleIcon/>
            </div>

            {/* Toggle visible => top-right */}
            <div className="absolute top-[8px] right-2 flex items-center gap-2">
                {/* Usa un Toggle, importado de tu UI, con pressed={social.visible} */}
                <Toggle
                    className="
            rounded-full
            w-12 h-6
            flex items-center justify-center
            hover:bg-purple-900
          "
                    pressed={social.visible}
                    onPressedChange={toggleVisible}
                >
                    {social.visible ? <EyeIcon/> : <EyeSlashIcon/>}
                </Toggle>
            </div>

            {/* Contenido principal => select + icon + input */}
            <div className="mt-4 flex items-start justify-between gap-4 items-center">
                {/* 1) Bloque: Select + Icon */}
                <div className="flex items-center gap-2">
                    {Icon && <div>{Icon}</div>}
                </div>

                {/* 2) Input URL */}
                <div className="flex-1 relative">
                    <Input
                        value={social.url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="URL"
                        className="
              w-full text-sm
              pl-8 pr-2 py-1
              rounded-[100px]
              hover:bg-purple-950/40
              focus:bg-purple-950/40
              bg-black/50
              border-gray-400
              focus-visible:ring-0
            "
                    />
                    {/* iconito a la izquierda (un link) */}
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6.75h3.75a2.25
                  2.25 0 0 1 2.25 2.25v6a2.25 2.25 0 0 1-2.25
                  2.25H13.5m-3 0H6.75a2.25 2.25 0 0
                  1-2.25-2.25v-6a2.25 2.25 0 0
                  1 2.25-2.25H10.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </li>
    );
}
