"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LinkData, SectionData } from "./types";
import MultiSectionsItem from "./multi-sections-item";

interface MultiSectionsContainerProps {
    containerId: string; // "no-section" o section.id
    items: string[];
    links: LinkData[];
    sections: SectionData[];
}

export default function MultiSectionsContainer({
                                                   containerId,
                                                   items,
                                                   links,
                                                   sections,
                                               }: MultiSectionsContainerProps) {
    // useDroppable => permite soltar en contenedores vacíos
    const { setNodeRef } = useDroppable({ id: containerId });

    let title = "Sin Sección";
    if (containerId !== "no-section") {
        const sec = sections.find((s) => s.id === containerId);
        if (sec) title = sec.title;
    }

    const linkObjects = items.map((id) => links.find((l) => l.id === id)).filter(Boolean);

    return (
        <div ref={setNodeRef} className="border p-4 rounded bg-white/5">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {linkObjects.map((link) => {
                        if (!link) return null;
                        return <MultiSectionsItem key={link.id} link={link} />;
                    })}
                </ul>
            </SortableContext>
            {items.length === 0 && (
                <p className="text-sm text-gray-400">Arrastra aquí enlaces para asignar</p>
            )}
        </div>
    );
}
