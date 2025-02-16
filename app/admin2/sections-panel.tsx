"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import SectionsPanelItem from "./sections-panel-item"; // <-- Ajusta la ruta
import { SectionData } from "./types";

/**
 * Muestra un panel para:
 * - Cargar secciones (GET /api/sections)
 * - Crear secciones (POST /api/sections)
 * - Reordenar secciones (PATCH /api/sections con array)
 * - Renombrar / eliminar cada sección
 */
export default function SectionsPanel() {
    const [sections, setSections] = useState<SectionData[]>([]);
    const [newSectionTitle, setNewSectionTitle] = useState("");

    // Cargar secciones al montar
    useEffect(() => {
        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSections(data);
                }
            })
            .catch((err) => console.error("Error fetching sections:", err));
    }, []);

    // Crear sección
    const handleCreateSection = async () => {
        if (!newSectionTitle.trim()) return;
        try {
            const res = await fetch("/api/sections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newSectionTitle.trim(),
                    position: sections.length, // la ponemos al final
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSections((prev) => [...prev, data]);
                setNewSectionTitle("");
            } else {
                console.error("Error creando sección:", data.error);
            }
        } catch (error) {
            console.error("Error creando sección:", error);
        }
    };

    // Eliminar sección
    const handleDeleteSection = async (id: string) => {
        try {
            const res = await fetch(`/api/sections?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                setSections((prev) => prev.filter((sec) => sec.id !== id));
            } else {
                console.error("Error eliminando sección:", data.error);
            }
        } catch (error) {
            console.error("Error eliminando sección:", error);
        }
    };

    // Editar (renombrar) sección
    const handleUpdateSection = async (id: string, updates: Partial<SectionData>) => {
        try {
            const res = await fetch("/api/sections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });
            const data = await res.json();
            if (res.ok) {
                setSections((prev) =>
                    prev.map((sec) => (sec.id === id ? { ...sec, ...data } : sec))
                );
            } else {
                console.error("Error actualizando sección:", data.error);
            }
        } catch (error) {
            console.error("Error actualizando sección:", error);
        }
    };

    // DndKit sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Reordenar secciones con drag & drop
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const newArr = arrayMove(sections, oldIndex, newIndex);
        // reasignar position localmente
        const updated = newArr.map((s, idx) => ({ ...s, position: idx }));
        setSections(updated);

        // PATCH en masa a /api/sections
        const res = await fetch("/api/sections", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated.map((s) => ({ id: s.id, position: s.position }))),
        });
        if (!res.ok) {
            const data = await res.json();
            console.error("Error reordenando secciones:", data.error);
        }
    };

    return (
        <div className="border p-4 my-8">
            <h2 className="text-xl font-semibold mb-4">Administrar Secciones</h2>

            {/* Crear Sección */}
            <div className="flex items-center gap-2 mb-4">
                <Input
                    placeholder="Título de la sección"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                />
                <Button onClick={handleCreateSection}>Crear Sección</Button>
            </div>

            {/* Lista de secciones con drag & drop */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                        {sections.map((sec) => (
                            <SectionsPanelItem
                                key={sec.id}
                                section={sec}
                                onDeleteSection={handleDeleteSection}
                                onUpdateSection={handleUpdateSection}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
}
