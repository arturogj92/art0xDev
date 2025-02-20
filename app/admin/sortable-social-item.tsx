"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";
import {SocialLinkData} from "./types";
import {FaGithub, FaInstagram, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube,} from "react-icons/fa6";

function HandleIcon() {
    return <svg width="16" height="16px" viewBox="0 0 25 25" fill="none" stroke="white"
                xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
              fill="#121923"/>
    </svg>
}

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
    onUpdate: (id: string, updates: Partial<SocialLinkData>) => void;
}

export function SortableSocialItem({social, onUpdate}: SortableSocialItemProps) {
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

    const Icon = getSocialIcon(social.name);

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="border p-2 rounded flex items-center justify-left gap-2 border-gray-500"
        >
            <div
                className="cursor-grab px-2 select-none text-sm text-white rounded w-fit"
                {...attributes}
                {...listeners}
            >
                <HandleIcon/>
            </div>
            <div className="flex items-center gap-2">
                {Icon && <span className="text-xl">{Icon}</span>}
                <select
                    className="border rounded p-1 border-gray-500"
                    value={social.name}
                    onChange={(e) => onUpdate(social.id, {name: e.target.value})}
                >
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                </select>
            </div>
            <div className="flex-1 flex flex-col border-gray-500">
                <label className="text-sm font-medium text-gray-300">URL</label>
                <Input
                    className={"border-gray-500"}
                    value={social.url}
                    onChange={(e) => onUpdate(social.id, {url: e.target.value})}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-medium">Visible</label>
                <Switch
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    checked={social.visible}
                    onCheckedChange={(checked) => onUpdate(social.id, {visible: checked})}
                />
            </div>
        </li>
    );
}
