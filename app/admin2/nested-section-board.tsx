"use client";

import React, { useEffect, useState } from "react";
import {
    DndContext,
    DragStartEvent,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

/** Tipos básicos */
interface SectionData {
    id: string;
    title: string;
    position: number;
}
interface LinkData {
    id: string;
    title: string;
    url: string;
    position: number;
    section_id: string | null;
}

/**
 * buildSectionId y buildLinkId:
 * - Para distinguir secciones de enlaces en un mismo tablero,
 *   creamos IDs con prefijo.
 */
function buildSectionId(secId: string) {
    return `section-${secId}`;
}
function buildLinkId(linkId: string) {
    return `link-${linkId}`;
}
/**
 * parseId: Determina si es "section" o "link" y extrae su ID real
 */
function parseId(fullId: string): { type: "section" | "link"; realId: string } {
    if (fullId.startsWith("section-")) {
        return { type: "section", realId: fullId.replace("section-", "") };
    }
    if (fullId.startsWith("link-")) {
        return { type: "link", realId: fullId.replace("link-", "") };
    }
    // fallback
    return { type: "link", realId: fullId };
}

/**
 * NestedSectionsBoard:
 * - Reordena secciones mismas (drag containers).
 * - Cada sección reordena enlaces dentro (drag items).
 * - Drag Overlay para fluidez.
 */
export default function NestedSectionsBoard() {
    // Estado simulado de secciones y enlaces
    const [sections, setSections] = useState<SectionData[]>([]);
    const [links, setLinks] = useState<LinkData[]>([]);
    // ID activo para Drag Overlay
    const [activeId, setActiveId] = useState<string | null>(null);

    // Simulamos carga inicial
    useEffect(() => {
        // Ejemplo: 3 secciones
        const initialSections: SectionData[] = [
            { id: "s1", title: "Sección 1", position: 0 },
            { id: "s2", title: "Sección 2", position: 1 },
            { id: "s3", title: "Sección 3", position: 2 },
        ];
        // Ejemplo: 5 enlaces
        const initialLinks: LinkData[] = [
            { id: "l1", title: "Link A", url: "http://a.com", position: 0, section_id: "s1" },
            { id: "l2", title: "Link B", url: "http://b.com", position: 1, section_id: "s1" },
            { id: "l3", title: "Link C", url: "http://c.com", position: 0, section_id: "s2" },
            { id: "l4", title: "Link D", url: "http://d.com", position: 0, section_id: null },
            { id: "l5", title: "Link E", url: "http://e.com", position: 1, section_id: null },
        ];
        setSections(initialSections);
        setLinks(initialLinks);
    }, []);

    // Sensores dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // onDragStart => guardamos activeId
    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    // onDragEnd => soltamos
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        // parseamos
        const activeInfo = parseId(active.id as string);
        const overInfo = parseId(over.id as string);

        // Si arrastramos una sección
        if (activeInfo.type === "section") {
            if (overInfo.type !== "section") {
                // No reorder si soltamos sobre un link
                return;
            }
            reorderSections(activeInfo.realId, overInfo.realId);

        } else {
            // arrastramos un link
            if (overInfo.type === "section") {
                // si soltamos link directamente sobre una sección (vacía)
                moveLinkToEmptySection(activeInfo.realId, overInfo.realId);
            } else {
                // arrastramos link sobre otro link
                reorderLinksInSameOrAnotherSection(activeInfo.realId, overInfo.realId);
            }
        }
    }

    // ============ Reordenar Secciones =================
    function reorderSections(activeSecId: string, overSecId: string) {
        // reorder en local
        setSections((prev) => {
            // find indices
            const oldIndex = prev.findIndex((s) => s.id === activeSecId);
            const newIndex = prev.findIndex((s) => s.id === overSecId);
            if (oldIndex < 0 || newIndex < 0) return prev;
            // arrayMove
            const newArr = arrayMove(prev, oldIndex, newIndex);
            // reasignar position
            return newArr.map((sec, idx) => ({ ...sec, position: idx }));
        });

        // PATCH en tu DB si deseas
    }

    // ============ Reordenar un link arrastrado sobre otro link ============
    function reorderLinksInSameOrAnotherSection(activeLinkId: string, overLinkId: string) {
        // local
        setLinks((prev) => {
            // 1. localizamos link active y link over
            const activeIndex = prev.findIndex((l) => l.id === activeLinkId);
            const overIndex = prev.findIndex((l) => l.id === overLinkId);
            if (activeIndex < 0 || overIndex < 0) return prev;

            const activeLink = prev[activeIndex];
            const overLink = prev[overIndex];

            // 2. Si están en la misma sección
            if (activeLink.section_id === overLink.section_id) {
                // reorder en la misma
                const sameSecLinks = prev.filter((l) => l.section_id === activeLink.section_id);
                // arrayMove
                const oldIndex = sameSecLinks.findIndex((l) => l.id === activeLinkId);
                const newIndex = sameSecLinks.findIndex((l) => l.id === overLinkId);
                // reordenamos
                const newSameSecLinks = arrayMove(sameSecLinks, oldIndex, newIndex);
                // reasignar position
                newSameSecLinks.forEach((lk, idx) => {
                    lk.position = idx;
                });
                // combinamos con el resto
                const otherLinks = prev.filter((l) => l.section_id !== activeLink.section_id);
                return [...newSameSecLinks, ...otherLinks];
            } else {
                // distinto contenedor => mover link a la sección de "over"
                activeLink.section_id = overLink.section_id;
                // ahora reorder en la nueva sección
                const newSecLinks = prev.filter((l) => l.section_id === overLink.section_id);
                // arrayMove => localIndices
                const oldIndex = newSecLinks.findIndex((l) => l.id === activeLinkId);
                let newIndex = newSecLinks.findIndex((l) => l.id === overLinkId);
                if (newIndex === -1) newIndex = newSecLinks.length;
                const result = arrayMove(newSecLinks, oldIndex, newIndex);
                // reasignar position
                result.forEach((lk, idx) => {
                    lk.position = idx;
                });
                // unimos con resto
                const otherLinks = prev.filter((l) => !result.includes(l));
                return [...otherLinks, ...result];
            }
        });

        // PATCH en tu DB
    }

    // ============ Mover link a una sección vacía (arrastrado sobre la sección en sí) ============
    function moveLinkToEmptySection(activeLinkId: string, overSecId: string) {
        setLinks((prev) => {
            const linkIndex = prev.findIndex((l) => l.id === activeLinkId);
            if (linkIndex < 0) return prev;
            // actualizamos section_id
            prev[linkIndex].section_id = overSecId;
            // reordenar en la nueva sección => se pondrá al final
            const newSecLinks = prev.filter((l) => l.section_id === overSecId);
            // si es la primera, position = 0
            // o arrayMove si arrastras sobre la "sección vacía"
            // en este caso, lo dejamos al final
            newSecLinks.forEach((lk, idx) => {
                lk.position = idx;
            });
            return structuredClone(prev);
        });

        // PATCH en tu DB
    }

    // ============ DRAG OVERLAY RENDERING ============
    // parse activeId para ver si es section o link
    const activeInfo = activeId ? parseId(activeId) : null;
    // localizamos el objeto
    let overlayElement: React.ReactNode = null;
    if (activeInfo) {
        if (activeInfo.type === "section") {
            const sec = sections.find((s) => s.id === activeInfo.realId);
            if (sec) {
                overlayElement = (
                    <div className="bg-gray-700 text-white px-3 py-2 rounded cursor-grab">
                        <strong>{sec.title}</strong> (Sección)
                    </div>
                );
            }
        } else {
            // link
            const lk = links.find((l) => l.id === activeInfo.realId);
            if (lk) {
                overlayElement = (
                    <div className="bg-gray-700 text-white px-3 py-2 rounded cursor-grab">
                        <strong>{lk.title}</strong> (Link)
                    </div>
                );
            }
        }
    }

    // ============ RENDER PRINCIPAL ============
    // build array de secciones (cada uno con "section-" ID)
    // + un SortableContext
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* SortableContext a nivel de secciones */}
            <SortableContext
                items={sections.map((sec) => buildSectionId(sec.id))}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                    {sections
                        .sort((a, b) => a.position - b.position)
                        .map((sec) => (
                            <SectionBox
                                key={sec.id}
                                section={sec}
                                links={links}
                            />
                        ))}
                </div>
            </SortableContext>

            {/* DRAG OVERLAY */}
            <DragOverlay>{overlayElement}</DragOverlay>
        </DndContext>
    );
}

/**
 * SectionBox:
 * - Se "arrastra" a nivel de secciones (useSortable => reordenar contenedor).
 * - Dentro, un SortableContext con los links => reordenar items.
 */
function SectionBox({
                        section,
                        links,
                    }: {
    section: SectionData;
    links: LinkData[];
}) {
    // useSortable => para reordenar la sección misma
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: buildSectionId(section.id),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
    };

    // Filtrar los links de esta sección
    const secLinks = links
        .filter((l) => l.section_id === section.id)
        .sort((a, b) => a.position - b.position);

    // Cada link => "link-xxx"
    const linkIds = secLinks.map((lk) => buildLinkId(lk.id));

    // Contenedor droppable para items
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: buildSectionId(section.id) + "-droppable",
    });

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded p-4 bg-white/5"
            {...attributes}
            {...listeners}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold">
                    {section.title} (SecID: {section.id})
                </div>
                <div className="text-sm text-gray-400">Arrastra ↑↓ para reordenar sección</div>
            </div>

            {/* SortableContext => reordenar items (links) dentro de la sección */}
            <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
                <div ref={setDroppableRef} className="space-y-2">
                    {secLinks.map((lk) => (
                        <LinkItem key={lk.id} link={lk} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

/**
 * LinkItem => "link-xxx"
 * Se arrastra dentro de su sección
 */
function LinkItem({ link }: { link: LinkData }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: buildLinkId(link.id),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-700 text-white rounded px-2 py-1 cursor-grab flex items-center"
            {...attributes}
            {...listeners}
        >
            <span className="mr-2">☰</span>
            <div>
                <div className="font-semibold">{link.title}</div>
                <div className="text-xs text-gray-300">{link.url}</div>
            </div>
        </div>
    );
}
