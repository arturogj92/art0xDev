"use client";

import {useEffect, useState} from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy,} from "@dnd-kit/sortable";
import {LinkData, SectionData} from "./types";
import MultiSectionsContainer from "./multi-sections-container";

interface MultiSectionsBoardProps {
    links: LinkData[];
    setLinks: React.Dispatch<React.SetStateAction<LinkData[]>>;
    sections: SectionData[];
    setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onDeleteLink: (id: string) => void;
}

export default function MultiSectionsBoard({
                                               links,
                                               setLinks,
                                               sections,
                                               setSections,
                                               onUpdateLink,
                                               onDeleteLink,
                                           }: MultiSectionsBoardProps) {
    const [containers, setContainers] = useState<{ id: string; items: string[] }[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        // En lugar de crear "no-section", simplemente lo omitimos.
        // Quedan solo las secciones reales
        const sortedSecs = [...sections].sort((a, b) => a.position - b.position);

        // Por cada sección, generamos un contenedor con sus enlaces
        const sectionContainers = sortedSecs.map((sec) => {
            const secItems = links
                .filter((l) => l.section_id === sec.id)   // <-- FILTRO
                .sort((a, b) => a.position - b.position)
                .map((l) => l.id);

            return { id: sec.id, items: secItems };
        });


        // Asignamos al estado
        setContainers(sectionContainers);
    }, [links, sections]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );


    // NUEVA FUNCIÓN:
    async function createLinkInSection(sectionId: string) {
        // 1. Construir un link "dummy"
        const dummyLink = {
            title: "Nuevo Enlace",
            url: "",
            image: "",
            visible: true,
            position: 0, // se ajustará después
            section_id: sectionId,
        };

        // 2. POST al backend
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dummyLink),
            });
            const data = await res.json();
            if (res.ok) {
                // 3. Insertar en estado local
                setLinks((prev) => [...prev, data]);
            } else {
                console.error("Error creando link:", data.error);
            }
        } catch (error) {
            console.error("Error creando link:", error);
        }
    }

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
        const section_id = containerId; // ya no usamos "no-section"
        setLinks((prev) => {
            const newLinks = structuredClone(prev);
            const link = newLinks.find((l) => l.id === linkId);
            if (link) {
                link.section_id = section_id;
            }
            return newLinks;
        });
        await fetch("/api/links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: linkId, section_id }),
        });
    }

    // Reasignar position => PATCH
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

    // ========== REORDENAR SECCIONES CON FLECHAS ========== (Si lo mantienes)
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
        const body = finalArr.map((sec) => ({
            id: sec.id,
            position: sec.position,
        }));
        await fetch("/api/sections", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    // Drag Overlay => ver si arrastramos un enlace
    const activeLink = activeId ? links.find((l) => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* SortableContext => contenedores de SECCIONES (no reordenamos secciones con drag) */}
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
                            moveSectionUp={moveSectionUp}
                            moveSectionDown={moveSectionDown}
                            idx={idx}
                            total={containers.length}
                            onUpdateLink={onUpdateLink}
                            onDeleteLink={onDeleteLink}
                            onCreateLinkInSection={createLinkInSection}
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
