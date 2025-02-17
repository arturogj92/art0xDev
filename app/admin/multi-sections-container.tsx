"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LinkData, SectionData } from "./types";
import MultiSectionsItem from "./multi-sections-item";

/** Icono flecha arriba (Heroicons) */
function ArrowUpIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    );
}
/** Icono flecha abajo (Heroicons) */
function ArrowDownIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

interface MultiSectionsContainerProps {
    containerId: string; // "no-section" o section.id
    items: string[];
    links: LinkData[];
    sections: SectionData[];
    moveSectionUp: (sectionId: string) => void;
    moveSectionDown: (sectionId: string) => void;
    idx: number;  // índice en el array
    total: number; // total de contenedores
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
}

export default function MultiSectionsContainer({
                                                   containerId,
                                                   items,
                                                   links,
                                                   sections,
                                                   moveSectionUp,
                                                   moveSectionDown,
                                                   idx,
                                                   total,
                                                   onUpdateLink,
                                               }: MultiSectionsContainerProps) {
    // droppable => permitir soltar enlaces
    const { setNodeRef } = useDroppable({ id: containerId });

    // Buscar la sección (si no es "no-section")
    const sec = sections.find((s) => s.id === containerId);
    const isNoSection = containerId === "no-section";

    // Título
    let title = "Sin Sección";
    if (sec) {
        title = sec.title;
    }

    // Lógica para ocultar flechas en la primera y última
    const hideUp = idx === 0;           // oculta flecha arriba en la primera
    const hideDown = idx === total - 1; // oculta flecha abajo en la última

    // Convertir items a objetos LinkData
    const linkObjects = items.map((id) => links.find((l) => l.id === id)).filter(Boolean);

    return (
        <div ref={setNodeRef} className="border p-4 rounded bg-white/5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{title}</h3>

                {/* Si es no-section => no flechas */}
                {/* Sino => flechas, ocultando la de arriba si hideUp y la de abajo si hideDown */}
                {!isNoSection && sec && (
                    <div className="flex items-center gap-2">
                        {/* Flecha arriba */}
                        <button
                            onClick={() => moveSectionUp(sec.id)}
                            className={`bg-black text-white rounded p-1 ${hideUp ? "hidden" : ""}`}
                            aria-label="Subir sección"
                        >
                            <ArrowUpIcon />
                        </button>
                        {/* Flecha abajo */}
                        <button
                            onClick={() => moveSectionDown(sec.id)}
                            className={`bg-black text-white rounded p-1 ${hideDown ? "hidden" : ""}`}
                            aria-label="Bajar sección"
                        >
                            <ArrowDownIcon />
                        </button>
                    </div>
                )}
            </div>

            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {linkObjects.map((link) => {
                        if (!link) return null;
                        return <MultiSectionsItem key={link.id} link={link} onUpdateLink={onUpdateLink} />;
                    })}
                </ul>
            </SortableContext>

            {items.length === 0 && (
                <p className="text-sm text-gray-400">Arrastra aquí enlaces para asignar</p>
            )}
        </div>
    );
}
