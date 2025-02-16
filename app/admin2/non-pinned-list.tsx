"use client";

import { DndContext, DragEndEvent, useSensor, useSensors } from "@dnd-kit/core";
import { PointerSensor, KeyboardSensor, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import { LinkData } from "./types";
import { SortableItem } from "./sortable-items";

interface NonPinnedListProps {
    normalLinks: LinkData[];
    editingLinkId: string | null;
    editingTitle: string;
    editingUrl: string;
    setEditingTitle: (val: string) => void;  // <--
    setEditingUrl: (val: string) => void;    // <--
    onStartEditing: (link: LinkData) => void;
    onSaveEditing: (id: string) => void;
    onCancelEditing: () => void;
    onDelete: (id: string) => void;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onReorder: (newLinks: LinkData[]) => void;
}

export function NonPinnedList({
                                  normalLinks,
                                  editingLinkId,
                                  editingTitle,
                                  editingUrl,
                                  setEditingTitle,
                                  setEditingUrl,
                                  onStartEditing,
                                  onSaveEditing,
                                  onCancelEditing,
                                  onDelete,
                                  onUpdateLink,
                                  onReorder,
                              }: NonPinnedListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = normalLinks.findIndex((l) => l.id === active.id);
        const newIndex = normalLinks.findIndex((l) => l.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const newArray = arrayMove(normalLinks, oldIndex, newIndex);
        const updated = newArray.map((link, idx) => ({ ...link, position: idx }));

        onReorder(updated);
    };

    return (
        <div>
            <h2 className="font-semibold mb-2">Enlaces No Pinned (Drag & Drop)</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={normalLinks.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                        {normalLinks.map((link) => (
                            <SortableItem
                                key={link.id}
                                link={link}
                                editingLinkId={editingLinkId}
                                editingTitle={editingTitle}
                                editingUrl={editingUrl}
                                setEditingTitle={setEditingTitle}  // <--
                                setEditingUrl={setEditingUrl}       // <--
                                onStartEditing={onStartEditing}
                                onSaveEditing={onSaveEditing}
                                onCancelEditing={onCancelEditing}
                                onDelete={onDelete}
                                onUpdateLink={onUpdateLink}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
}
