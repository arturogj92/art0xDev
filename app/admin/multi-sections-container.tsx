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
    // Funciones para flechas
    moveSectionUp: (sectionId: string) => void;
    moveSectionDown: (sectionId: string) => void;
}

export default function MultiSectionsContainer({
                                                   containerId,
                                                   items,
                                                   links,
                                                   sections,
                                                   moveSectionUp,
                                                   moveSectionDown,
                                               }: MultiSectionsContainerProps) {
    // Buscamos la sección real (si no es "no-section")
    const sec = sections.find((s) => s.id === containerId);

    let title = "Sin Sección";
    let isNoSection = true;
    if (sec) {
        title = sec.title;
        isNoSection = false;
    }

    // droppable => para soltar enlaces
    const { setNodeRef } = useDroppable({ id: containerId });

    // Convertimos items => LinkData
    const linkObjects = items.map((id) => links.find((l) => l.id === id)).filter(Boolean);

    return (
        <div ref={setNodeRef} className="border p-4 rounded bg-white/5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                    {title}
                </h3>
                {/* Si es una sección real, mostramos flechas */}
                {!isNoSection && sec && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => moveSectionUp(sec.id)}
                            className="bg-gray-200 px-2"
                        >
                            ↑
                        </button>
                        <button
                            onClick={() => moveSectionDown(sec.id)}
                            className="bg-gray-200 px-2"
                        >
                            ↓
                        </button>
                    </div>
                )}
            </div>

            {/* SortableContext para enlaces */}
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
