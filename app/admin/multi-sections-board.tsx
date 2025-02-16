"use client";

import { useEffect, useState } from "react";
import {
    DndContext,
    DragStartEvent,
    DragEndEvent,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { LinkData, SectionData } from "./types";
import MultiSectionsContainer from "./multi-sections-container";

/**
 * Reordena enlaces con drag & drop, y secciones con flechas (dentro del contenedor).
 * - links, setLinks => para actualizar enlaces
 * - sections, setSections => para actualizar secciones
 */
interface MultiSectionsBoardProps {
    links: LinkData[];
    setLinks: React.Dispatch<React.SetStateAction<LinkData[]>>;
    sections: SectionData[];
    setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
}

export default function MultiSectionsBoard({
                                               links,
                                               setLinks,
                                               sections,
                                               setSections,
                                           }: MultiSectionsBoardProps) {
    const [containers, setContainers] = useState<{ id: string; items: string[] }[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        // 1. "no-section"
        const noSectionItems = links
            .filter((l) => !l.pinned && !l.section_id)
            .sort((a, b) => a.position - b.position)
            .map((l) => l.id);

        // 2. Secciones reales
        const sectionContainers = sections
            .sort((a, b) => a.position - b.position)
            .map((sec) => {
                const secItems = links
                    .filter((l) => !l.pinned && l.section_id === sec.id)
                    .sort((a, b) => a.position - b.position)
                    .map((l) => l.id);

                return { id: sec.id, items: secItems };
            });

        setContainers([
            { id: "no-section", items: noSectionItems },
            ...sectionContainers,
        ]);
    }, [links, sections]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // ========== DRAG & DROP PARA ENLACES ==========
    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeContainer = containers.find((c) =>
            c.items.includes(active.id as string)
        );
        const overContainer =
            containers.find((c) => c.items.includes(over.id as string)) ||
            containers.find((c) => c.id === (over.id as string));

        if (!activeContainer || !overContainer) return;
        if (activeContainer.id === overContainer.id && active.id === over.id) {
            return;
        }

        const newContainers = structuredClone(containers);

        const fromIndex = newContainers.findIndex((c) => c.id === activeContainer.id);
        const toIndex = newContainers.findIndex((c) => c.id === overContainer.id);

        const fromItems = newContainers[fromIndex].items;
        const toItems = newContainers[toIndex].items;

        const oldIndex = fromItems.indexOf(active.id as string);
        let newIndex = toItems.indexOf(over.id as string);
        if (newIndex === -1) {
            newIndex = toItems.length;
        }

        if (activeContainer.id === overContainer.id) {
            // Reordenar enlaces en la misma sección
            const reordered = arrayMove(fromItems, oldIndex, newIndex);
            newContainers[fromIndex].items = reordered;
            reorderLinksInContainer(reordered);
        } else {
            // Mover enlace a otra sección
            fromItems.splice(oldIndex, 1);
            toItems.splice(newIndex, 0, active.id as string);

            updateLinkContainer(active.id as string, overContainer.id);

            reorderLinksInContainer(toItems);
            reorderLinksInContainer(fromItems);
        }

        setContainers(newContainers);
    }

    // Actualiza section_id => PATCH
    async function updateLinkContainer(linkId: string, containerId: string) {
        const section_id = containerId === "no-section" ? null : containerId;
        setLinks((prev) => {
            const newLinks = structuredClone(prev);
            const link = newLinks.find((l) => l.id === linkId);
            if (link) {
                link.section_id = section_id;
                link.pinned = false;
            }
            return newLinks;
        });
        await fetch("/api/links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: linkId, pinned: false, section_id }),
        });
    }

    // Reasigna position => PATCH
    async function reorderLinksInContainer(itemIds: string[]) {
        setLinks((prev) => {
            const newLinks = structuredClone(prev);
            itemIds.forEach((id, idx) => {
                const link = newLinks.find((l) => l.id === id);
                if (link) {
                    link.position = idx;
                }
            });
            return newLinks;
        });

        const updates = itemIds.map((id, idx) => ({ id, position: idx }));
        await fetch("/api/links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
    }

    // ========== REORDENAR SECCIONES CON FLECHAS (dentro del contenedor) ==========
    // Llamado por multi-sections-container
    function moveSectionUp(sectionId: string) {
        setSections((prev) => {
            const idx = prev.findIndex((s) => s.id === sectionId);
            if (idx <= 0) return prev;
            const newArr = [...prev];
            [newArr[idx], newArr[idx - 1]] = [newArr[idx - 1], newArr[idx]];
            newArr.forEach((sec, i) => {
                sec.position = i;
            });
            patchSections(newArr);
            return newArr;
        });
    }

    function moveSectionDown(sectionId: string) {
        setSections((prev) => {
            const idx = prev.findIndex((s) => s.id === sectionId);
            if (idx < 0 || idx >= prev.length - 1) return prev;
            const newArr = [...prev];
            [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
            newArr.forEach((sec, i) => {
                sec.position = i;
            });
            patchSections(newArr);
            return newArr;
        });
    }

    async function patchSections(finalArr: SectionData[]) {
        try {
            const body = finalArr.map((sec) => ({
                id: sec.id,
                position: sec.position,
            }));
            await fetch("/api/sections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
        } catch (error) {
            console.error("Error patching sections:", error);
        }
    }

    // Drag Overlay => ver si arrastramos un enlace
    const activeLink = activeId ? links.find((l) => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* SortableContext => contenedores para secciones,
          pero NO reordenamos contenedores con drag,
          sino que se mantiene la disposición. */}
            <SortableContext
                items={containers.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-6">
                    {containers.map((container) => (
                        <MultiSectionsContainer
                            key={container.id}
                            containerId={container.id}
                            items={container.items}
                            links={links}
                            sections={sections}
                            moveSectionUp={moveSectionUp}    // <-- flechas
                            moveSectionDown={moveSectionDown} // <-- flechas
                        />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeLink ? (
                    <div className="cursor-grab text-sm text-gray-300 bg-gray-700 rounded px-2 p-2">
                        <div className="font-semibold">{activeLink.title}</div>
                        <div className="text-xs text-gray-400">{activeLink.url}</div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
