"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    DndContext,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { SocialLinkData } from "./types";
import { SortableSocialItem } from "./sortable-social-item";

export default function SocialLinksPanel() {
    const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
    const [newSocial, setNewSocial] = useState<Omit<SocialLinkData, "id">>({
        name: "instagram",
        url: "",
        visible: true,
        position: 0,
    });

    // 1. Cargar la lista
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

    // 2. Crear
    async function handleCreate() {
        try {
            const res = await fetch("/api/social-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSocial),
            });
            const data = await res.json();
            if (res.ok) {
                setSocialLinks((prev) => [...prev, data]);
                setNewSocial({
                    name: "instagram",
                    url: "",
                    visible: true,
                    position: 0,
                });
            } else {
                console.error("Error creating social link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 4. Actualizar
    async function handleUpdate(id: string, updates: Partial<SocialLinkData>) {
        try {
            console.log("Creando social link:", newSocial);
            console.log("Creando updates :", updates);


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

    // 5. Reordenar con dnd-kit
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = socialLinks.findIndex((s) => s.id === active.id);
        const newIndex = socialLinks.findIndex((s) => s.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const newArr = arrayMove(socialLinks, oldIndex, newIndex);
        // reasignar position local
        const updated = newArr.map((s, idx) => ({ ...s, position: idx }));
        setSocialLinks(updated);

        // PATCH masivo
        fetch("/api/social-links", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                updated.map((item) => ({
                    id: item.id,
                    position: item.position,
                }))
            ),
        });
    }

    return (
        <div className="border p-4 my-8">
            <h2 className="text-xl font-semibold mb-4">Gestionar Redes Sociales</h2>

            {/* Crear red social */}
            <div className="border p-2 mb-6 space-y-2">
                <h3 className="font-medium">Crear Red Social</h3>
                <select
                    className="border rounded p-1"
                    value={newSocial.name}
                    onChange={(e) =>
                        setNewSocial((prev) => ({ ...prev, name: e.target.value }))
                    }
                >
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                </select>
                <Input
                    placeholder="URL"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial((prev) => ({ ...prev, url: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                    <label>Visible:</label>
                    <Switch
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        checked={newSocial.visible}
                        onCheckedChange={(checked) =>
                            setNewSocial((prev) => ({ ...prev, visible: checked }))
                        }
                    />
                </div>
                <Button onClick={handleCreate}>Crear</Button>
            </div>

            {/* Lista con drag & drop */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
