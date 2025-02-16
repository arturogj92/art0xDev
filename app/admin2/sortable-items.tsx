"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkData } from "./types";
import { IconGripVertical } from "lucide-react"; // Por ejemplo, un icono

interface SortableItemProps {
    link: LinkData;
}

export default function SortableItem({ link }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
    };

    return (
        <li ref={setNodeRef} style={style} className="border rounded p-2 bg-white/10 flex items-center">
            {/* Contenido del link */}
            <div className="flex-1">
                <div className="font-semibold">{link.title}</div>
                <div className="text-xs text-gray-400">{link.url}</div>
            </div>

            {/* Drag handle: SOLO aquí ponemos {...listeners} {...attributes} */}
            <div
                className="drag-handle cursor-grab text-sm text-gray-300 ml-2 p-2"
                {...attributes}
                {...listeners}
            >
                <IconGripVertical /> {/* Un icono, por ejemplo */}
            </div>
        </li>
    );
}
