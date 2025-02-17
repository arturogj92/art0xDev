"use client";

import {useDroppable} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LinkData, SectionData} from "./types";
import MultiSectionsItem from "./multi-sections-item";

function AddLink() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path
                d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
        </svg>
    )
}


/** Icono flecha arriba (Heroicons) */
function ArrowUpIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd"
                  d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                  clipRule="evenodd"/>
        </svg>
    );
}

/** Icono flecha abajo (Heroicons) */
function ArrowDownIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"/>
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
    onDeleteLink: (id: string) => void;
    onCreateLinkInSection: (sectionId: string) => void;
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
                                                   onDeleteLink,
                                                   onCreateLinkInSection,
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
                        {sec && (
                            <button
                                onClick={() => onCreateLinkInSection(sec.id)}
                                className="bg-black text-white rounded px-2"
                            >
                                <AddLink/>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {linkObjects.map((link) => {
                        if (!link) return null;
                        return <MultiSectionsItem key={link.id} link={link} onUpdateLink={onUpdateLink}
                                                  onDeleteLink={onDeleteLink}/>;
                    })}
                </ul>
            </SortableContext>

            {items.length === 0 && (
                <p className="text-sm text-gray-400">Arrastra aquí enlaces para asignar</p>
            )}
        </div>
    );
}
