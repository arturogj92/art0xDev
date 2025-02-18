"use client";

import {useEffect, useState} from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LinkData, SectionData} from "./types";
import MultiSectionsItem from "./multi-sections-item";

/** Iconos para los botones */
function AddLink() {
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

function ArrowUpIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
        >
            <path
                fillRule="evenodd"
                d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06l4.25-4.25Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function ArrowDownIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
        >
            <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 13.06l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="black"
            className="size-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM19.5 7.125 16.862 4.487"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="black"
            className="size-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397M4.75 5.75h14.5"
            />
        </svg>
    );
}

interface MultiSectionsContainerProps {
    containerId: string;
    items: string[];
    links: LinkData[];
    sections: SectionData[];
    moveSectionUp: (sectionId: string) => void;
    moveSectionDown: (sectionId: string) => void;
    idx: number;
    total: number;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onDeleteLink: (id: string) => void;
    onCreateLinkInSection: (sectionId: string) => void;
    onUpdateSection: (id: string, updates: Partial<SectionData>) => void;
    onDeleteSection: (id: string) => void;
    onLinksReordered?: () => void;
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
                                                   onUpdateSection,
                                                   onDeleteSection,
                                                   onLinksReordered,

                                               }: MultiSectionsContainerProps) {
    const { setNodeRef } = useDroppable({ id: containerId });
    const sec = sections.find((s) => s.id === containerId);
    const isNoSection = containerId === "no-section";

    const hideUp = idx === 0;
    const hideDown = idx === total - 1;
    const linkObjects = items.map((id) => links.find((l) => l.id === id)).filter(Boolean);

    // Edición de sección
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [editTitle, setEditTitle] = useState(sec?.title || "");
    const [showDeleteModalSection, setShowDeleteModalSection] = useState(false);

    useEffect(() => {
        if (sec) {
            setEditTitle(sec.title);
        }
    }, [sec]);

    function handleSaveSection() {
        if (!sec) return;
        onUpdateSection(sec.id, {title: editTitle});
        setIsEditingSection(false);
    }

    function handleCancelSection() {
        if (!sec) return;
        setIsEditingSection(false);
        setEditTitle(sec.title);
    }

    function handleDeleteClick() {
        setShowDeleteModalSection(true);
    }

    function confirmDeleteSection() {
        setShowDeleteModalSection(false);
        if (sec) {
            onDeleteSection(sec.id);
        }
    }

    function cancelDeleteSection() {
        setShowDeleteModalSection(false);
    }

    return (
        <div ref={setNodeRef} className="border border-purple-900 p-4 rounded bg-black">
            <div className="flex items-center justify-between mb-2">
                {isEditingSection && sec ? (
                    <div className="flex items-center gap-2">
                        <input
                            className="border rounded p-1"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <button
                            onClick={handleSaveSection}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelSection}
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <h3 className="font-semibold text-lg">
                        {isNoSection ? "Sin Sección" : sec?.title}
                    </h3>
                )}

                {!isNoSection && sec && !isEditingSection && (
                    <div className="flex items-center gap-2">
                        {!hideUp && (
                            <button
                                onClick={() => moveSectionUp(sec.id)}
                                className="bg-black text-white rounded p-1"
                                aria-label="Subir sección"
                            >
                                <ArrowUpIcon/>
                            </button>
                        )}
                        {!hideDown && (
                            <button
                                onClick={() => moveSectionDown(sec.id)}
                                className="bg-black text-white rounded p-1"
                                aria-label="Bajar sección"
                            >
                                <ArrowDownIcon/>
                            </button>
                        )}
                        <button
                            onClick={() => onCreateLinkInSection(containerId)}
                            className="bg-black text-white rounded p-1 flex items-center gap-1"
                        >
                            <AddLink/>
                            <span className="hidden sm:inline">Link</span>
                        </button>
                        <button
                            onClick={() => setIsEditingSection(true)}
                            className="bg-gray-300 text-white px-1 py-1 rounded flex items-center gap-1"
                        >
                            <PencilIcon/>
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="bg-gray-300 text-white px-1 py-1 rounded flex items-center"
                        >
                            <TrashIcon/>
                        </button>
                    </div>
                )}
            </div>

            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2">
                    {linkObjects.map((link) => {
                        if (!link) return null;
                        return (
                            <MultiSectionsItem
                                key={link.id}
                                link={link}
                                onUpdateLink={onUpdateLink}
                                onDeleteLink={onDeleteLink}
                            />
                        );
                    })}
                </ul>
            </SortableContext>

            {items.length === 0 && (
                <p className="text-sm text-gray-400">Arrastra aquí enlaces para asignar</p>
            )}

            {showDeleteModalSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-black w-full max-w-sm mx-auto p-4 rounded shadow-lg">
                        <p className="mb-4">¿Seguro que deseas borrar esta sección?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelDeleteSection}
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteSection}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Borrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
