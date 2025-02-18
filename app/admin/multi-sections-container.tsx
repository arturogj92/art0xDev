"use client";

import {useDroppable} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LinkData, SectionData} from "./types";
import MultiSectionsItem from "./multi-sections-item";

function AddLinkIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
        >
            <path
                d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
        </svg>
    );
}

interface MultiSectionsContainerProps {
    containerId: string; // "no-section" o section.id
    items: string[];
    links: LinkData[];
    sections: SectionData[];
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onDeleteLink: (id: string) => void;
    onUpdateSection: (id: string, updates: Partial<SectionData>) => void;
    onDeleteSection: (id: string) => void;
    idx: number;
    total: number;
}

export default function MultiSectionsContainer({
                                                   containerId,
                                                   items,
                                                   links,
                                                   sections,
                                                   onUpdateLink,
                                                   onDeleteLink,
                                                   onUpdateSection,
                                                   onDeleteSection,
                                                   idx,
                                                   total,
                                               }: MultiSectionsContainerProps) {
    const { setNodeRef } = useDroppable({ id: containerId });

    const sec = sections.find((s) => s.id === containerId);
    const isNoSection = containerId === "no-section";
    const hideUp = idx === 0;
    const hideDown = idx === total - 1;

    // Convertir items => LinkData
    const linkObjects = items
        .map((id) => links.find((l) => l.id === id))
        .filter(Boolean) as LinkData[];

    return (
        <div ref={setNodeRef} className="border border-purple-900 p-4 rounded bg-black">
            {/* Título sección o "Sin sección" */}
            <h3 className="font-semibold text-lg mb-2">
                {isNoSection ? "Sin Sección" : sec?.title}
            </h3>

            {/* (Opcional) flechas o acciones de sección */}
            {/* ... tu lógica de editar sección, borrar sección, etc. ... */}

            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {linkObjects.map((link) => (
                        <MultiSectionsItem
                            key={link.id}
                            link={link}
                            onUpdateLink={onUpdateLink}
                            onDeleteLink={onDeleteLink}
                        />
                    ))}
                </ul>
            </SortableContext>

            {items.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Arrastra aquí enlaces para asignar</p>
            )}

            {/* Botón para crear un link dummy en esta sección, si lo deseas */}
            {!isNoSection && (
                <button className="mt-2 flex items-center gap-1 bg-gray-700 text-white px-2 py-1 rounded">
                    <AddLinkIcon/>
                    <span>Nuevo Link</span>
                </button>
            )}
        </div>
    );
}
