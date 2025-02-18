"use client";

import {useEffect, useState} from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {LinkData, SectionData} from "./types";
import MultiSectionsContainer from "./multi-sections-container";

interface MultiSectionsBoardProps {
    links: LinkData[];
    setLinks: React.Dispatch<React.SetStateAction<LinkData[]>>;
    sections: SectionData[];
    setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onDeleteLink: (id: string) => void;
    onUpdateSection: (id: string, updates: Partial<SectionData>) => void;
    onDeleteSection: (id: string) => void;

    /** NUEVO: callback para notificar que se ha reordenado enlaces */
    onLinksReordered?: () => void;
}

export default function MultiSectionsBoard({
                                               links,
                                               setLinks,
                                               sections,
                                               setSections,
                                               onUpdateLink,
                                               onDeleteLink,
                                               onUpdateSection,
                                               onDeleteSection,
                                               onLinksReordered,
                                           }: MultiSectionsBoardProps) {
    const [containers, setContainers] = useState<{ id: string; items: string[] }[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        // Sin sección
        const noSectionItems = links
            .filter((l) => l.section_id === null)
            .sort((a, b) => a.position - b.position)
            .map((l) => l.id);

        // Secciones
        const sortedSecs = [...sections].sort((a, b) => a.position - b.position);

        const sectionContainers = sortedSecs.map((sec) => {
            const secItems = links
                .filter((l) => l.section_id === sec.id)
                .sort((a, b) => a.position - b.position)
                .map((l) => l.id);

            return { id: sec.id, items: secItems };
        });

        setContainers([{id: "no-section", items: noSectionItems}, ...sectionContainers]);
    }, [links, sections]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
        setShowOverlay(false);
    }

    function handleDragOver(event: DragOverEvent) {
        const {active, over} = event;
        if (!over) return;

        const activeContainer = containers.find((c) => c.items.includes(active.id as string));
        const overContainer =
            containers.find((c) => c.items.includes(over.id as string)) ||
            containers.find((c) => c.id === (over.id as string));

        if (!activeContainer || !overContainer) {
            setShowOverlay(false);
            return;
        }
        setShowOverlay(activeContainer.id !== overContainer.id);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);
        setShowOverlay(false);

        if (!over) return;

        const activeContainer = containers.find((c) => c.items.includes(active.id as string));
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
            // Reordenar dentro de la misma sección
            const reordered = arrayMove(fromItems, oldIndex, newIndex);
            newContainers[fromIndex].items = reordered;
            reorderLinksInContainer(reordered);
        } else {
            // Mover a otra sección
            fromItems.splice(oldIndex, 1);
            toItems.splice(newIndex, 0, active.id as string);

            updateLinkContainer(active.id as string, overContainer.id);

            reorderLinksInContainer(toItems);
            reorderLinksInContainer(fromItems);
        }

        setContainers(newContainers);

        // Notificar al padre que se ha reordenado
        onLinksReordered?.();
    }

    async function updateLinkContainer(linkId: string, containerId: string) {
        const newSectionId = containerId === "no-section" ? null : containerId;
        setLinks((prev) => {
            const newLinks = structuredClone(prev);
            const link = newLinks.find((l) => l.id === linkId);
            if (link) {
                link.section_id = newSectionId;
            }
            return newLinks;
        });
        await fetch("/api/links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: linkId, section_id: newSectionId}),
        });
    }

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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={containers.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-6">
                    {containers.map((container, idx) => (
                        <MultiSectionsContainer
                            key={container.id}
                            containerId={container.id}
                            items={container.items}
                            links={links}
                            sections={sections}
                            onUpdateLink={onUpdateLink}
                            onDeleteLink={onDeleteLink}
                            onUpdateSection={onUpdateSection}
                            onDeleteSection={onDeleteSection}
                            idx={idx}
                            total={containers.length}
                        />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
                {showOverlay && activeId ? (
                    <OverlayItem link={links.find((l) => l.id === activeId)!}/>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function OverlayItem({link}: { link: LinkData }) {
    return (
        <div className="cursor-grab text-sm text-gray-300 bg-gray-700 rounded px-2 p-2">
            <div className="font-semibold">{link.title}</div>
            <div className="text-xs text-gray-400">{link.url}</div>
        </div>
    );
}
