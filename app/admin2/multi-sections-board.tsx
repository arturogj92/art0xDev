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
import MultiSectionsItem from "./multi-sections-item"; // Para renderizar en overlay

interface MultiSectionsBoardProps {
    links: LinkData[];
    setLinks: (val: LinkData[]) => void;
    sections: SectionData[];
}

export default function MultiSectionsBoard({
                                               links,
                                               setLinks,
                                               sections,
                                           }: MultiSectionsBoardProps) {
    const [containers, setContainers] = useState<{ id: string; items: string[] }[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null); // para overlay

    useEffect(() => {
        // Construir contenedores
        const noSectionItems = links
            .filter((l) => !l.pinned && !l.section_id)
            .sort((a, b) => a.position - b.position)
            .map((l) => l.id);

        const newContainers = [
            {
                id: "no-section",
                items: noSectionItems,
            },
            ...sections
                .sort((a, b) => a.position - b.position)
                .map((sec) => {
                    const secItems = links
                        .filter((l) => !l.pinned && l.section_id === sec.id)
                        .sort((a, b) => a.position - b.position)
                        .map((l) => l.id);
                    return {
                        id: sec.id,
                        items: secItems,
                    };
                }),
        ];

        setContainers(newContainers);
    }, [links, sections]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Manejamos dragStart y dragEnd
    function handleDragStart(event: DragStartEvent) {
        // guardamos el activeId en el estado
        const { active } = event;
        setActiveId(active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null); // limpiamos overlay

        if (!over) return;

        const activeContainer = containers.find((c) => c.items.includes(active.id));
        const overContainer =
            containers.find((c) => c.items.includes(over.id)) ||
            containers.find((c) => c.id === over.id);

        if (!activeContainer || !overContainer) return;
        if (activeContainer.id === overContainer.id && active.id === over.id) {
            return;
        }

        const newContainers = structuredClone(containers);

        const fromIndex = newContainers.findIndex((c) => c.id === activeContainer.id);
        const toIndex = newContainers.findIndex((c) => c.id === overContainer.id);

        const fromItems = newContainers[fromIndex].items;
        const toItems = newContainers[toIndex].items;

        const oldIndex = fromItems.indexOf(active.id);
        let newIndex = toItems.indexOf(over.id);
        if (newIndex === -1) {
            newIndex = toItems.length;
        }

        if (activeContainer.id === overContainer.id) {
            // Mover dentro de la misma sección
            const reordered = arrayMove(fromItems, oldIndex, newIndex);
            newContainers[fromIndex].items = reordered;

            reorderLinksInContainer(reordered, activeContainer.id);

        } else {
            // Mover a otro contenedor
            fromItems.splice(oldIndex, 1);
            toItems.splice(newIndex, 0, active.id);

            updateLinkContainer(active.id, overContainer.id);

            reorderLinksInContainer(toItems, overContainer.id);
            reorderLinksInContainer(fromItems, activeContainer.id);
        }

        setContainers(newContainers);
    }

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

    async function reorderLinksInContainer(itemIds: string[], containerId: string) {
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

    // Para renderizar en overlay
    const activeLink = activeId ? links.find((l) => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={containers.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-6">
                    {containers.map((container) => (
                        <MultiSectionsContainer
                            key={container.id}
                            containerId={container.id}
                            items={container.items}
                            links={links}
                            sections={sections}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* DRAG OVERLAY */}
            <DragOverlay>
                {activeLink ? (
                    // Reutilizamos el mismo item con su estilo
                    <div className="cursor-grab text-sm text-gray-300 bg-gray-700 rounded px-2 p-2">
                        {/* O tu MultiSectionsItem, con un style de overlay */}
                        <div className="font-semibold">{activeLink.title}</div>
                        <div className="text-xs text-gray-400">{activeLink.url}</div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
