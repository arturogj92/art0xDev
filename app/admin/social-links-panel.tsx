"use client";

import {useEffect, useState} from "react";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy,} from "@dnd-kit/sortable";
import {SocialLinkData} from "./types";
import {SortableSocialItem} from "./sortable-social-item";

interface SocialLinksPanelProps {
    /** Called when a social link is reordered (optional) */
    onReorder?: () => void;
}

export default function SocialLinksPanel({onReorder}: SocialLinksPanelProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

    useEffect(() => {
        fetch("/api/social-links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSocialLinks(data);
                }
            })
            .catch((err) => console.error("Error fetching social links:", err));
    }, []);

    async function handleUpdate(id: string, updates: Partial<SocialLinkData>) {
        try {
            const res = await fetch("/api/social-links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });
            const data = await res.json();
            if (res.ok) {
                setSocialLinks((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, ...data } : s))
                );
            } else {
                console.error("Error updating social link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = socialLinks.findIndex((s) => s.id === active.id);
        const newIndex = socialLinks.findIndex((s) => s.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const newArr = arrayMove(socialLinks, oldIndex, newIndex);
        const updated = newArr.map((s, idx) => ({ ...s, position: idx }));
        setSocialLinks(updated);

        fetch("/api/social-links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                updated.map((item) => ({id: item.id, position: item.position}))
            ),
        });

        // Call the callback to refresh the iframe if needed
        onReorder?.();
    }

    return (
        <div className="border p-4 my-8 border-blue-900 border-dashed">
            <h2 className="text-lg font-semibold">Social Links</h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={socialLinks.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="space-y-2">
                        {socialLinks
                            .sort((a, b) => a.position - b.position)
                            .map((soc) => (
                                <SortableSocialItem
                                    key={soc.id}
                                    social={soc}
                                    onUpdate={handleUpdate}
                                />
                            ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
}
