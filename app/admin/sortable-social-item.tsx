"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SocialLinkData } from "./types";
import {
    FaInstagram,
    FaYoutube,
    FaTiktok,
    FaGithub,
    FaXTwitter,
    FaLinkedin,
} from "react-icons/fa6";

function getSocialIcon(name: string) {
    switch (name) {
        case "instagram":
            return <FaInstagram />;
        case "twitter":
            return <FaXTwitter />;
        case "youtube":
            return <FaYoutube />;
        case "tiktok":
            return <FaTiktok />;
        case "github":
            return <FaGithub />;
        case "linkedin":
            return <FaLinkedin />;
        default:
            return null;
    }
}

interface SortableSocialItemProps {
    social: SocialLinkData;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<SocialLinkData>) => void;
}

export function SortableSocialItem({
                                       social,
                                       onDelete,
                                       onUpdate,
                                   }: SortableSocialItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: social.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "rgba(255,255,255,0.1)" : "transparent",
    };

    // Icon
    const Icon = getSocialIcon(social.name);

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="border p-2 rounded flex flex-col gap-2"
        >
            {/* Drag handle */}
            <div
                className="cursor-grab px-2 select-none text-sm bg-gray-700 text-white rounded w-fit"
                {...attributes}
                {...listeners}
            >
                Arrastra
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                {/* Icono + Nombre */}
                <div className="flex items-center gap-2">
                    {Icon && <span className="text-xl">{Icon}</span>}
                    <select
                        className="border rounded p-1"
                        value={social.name}
                        onChange={(e) => onUpdate(social.id, { name: e.target.value })}
                    >
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                    </select>
                </div>

                {/* URL */}
                <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium">URL</label>
                    <Input
                        value={social.url}
                        onChange={(e) => onUpdate(social.id, { url: e.target.value })}
                    />
                </div>

                {/* Visible */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Visible</label>
                    <Switch
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        checked={social.visible}
                        onCheckedChange={(checked) =>
                            onUpdate(social.id, { visible: checked })
                        }
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button variant="destructive" onClick={() => onDelete(social.id)}>
                    Eliminar
                </Button>
            </div>
        </li>
    );
}
