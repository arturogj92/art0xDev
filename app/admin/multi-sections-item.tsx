"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LinkData } from "./types";

interface MultiSectionsItemProps {
    link: LinkData;
}

export default function MultiSectionsItem({ link }: MultiSectionsItemProps) {
    const {
        // `setNodeRef`: referencia para el contenedor general
        setNodeRef,
        // `setActivatorNodeRef`: referencia para el "handle"
        setActivatorNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: link.id,
        // handle: true // (opcional) si deseas forzar la lógica de "handle"
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
    };

    return (
        <li ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 border rounded bg-white/10">
            {/* Aquí el "icono" que sirve de handle.
          Ponemos ref={setActivatorNodeRef} + {...attributes} + {...listeners}. */}
                <div
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-sm text-gray-300 bg-gray-700 rounded px-2"
                    role="button"
                    aria-roledescription="sortable-handle"
                >
                    ☰
                </div>

            {/* Resto del contenido, sin events de drag */}
                <div>
                    <div className="font-semibold">{link.title}</div>
                    <div className="text-xs text-gray-400">{link.url}</div>
                </div>
        </li>
    );
}
