"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LinkData } from "./types";

interface MultiSectionsItemProps {
    link: LinkData;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
}

export default function MultiSectionsItem({
                                              link,
                                              onUpdateLink,
                                          }: MultiSectionsItemProps) {
    // Lógica de arrastre
    const {
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
    };

    const [isEditing, setIsEditing] = useState(false);

    // Campos en modo edición
    const [editTitle, setEditTitle] = useState(link.title);
    const [editUrl, setEditUrl] = useState(link.url);
    const [editImage, setEditImage] = useState(link.image ?? "");
    // El toggle “visible” se sacará del modo edición. Se quita de aquí o se mantiene si deseas.
    // Si deseas mantenerlo editable también en modo edición, podrías duplicar la lógica.

    function handleSave() {
        onUpdateLink(link.id, {
            title: editTitle,
            url: editUrl,
            image: editImage,
        });
        setIsEditing(false);
    }

    function handleCancel() {
        setIsEditing(false);
        setEditTitle(link.title);
        setEditUrl(link.url);
        setEditImage(link.image ?? "");
    }

    // Función para cambiar visibilidad sin entrar en modo edición
    function toggleVisible(checked: boolean) {
        onUpdateLink(link.id, { visible: checked });
    }

    return (
        <li ref={setNodeRef} style={style} className="border p-2 rounded bg-white/10">
            {isEditing ? (
                // === MODO EDICIÓN ===
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Título:</label>
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm">URL:</label>
                        <Input
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Imagen:</label>
                        <Input
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                        />
                    </div>

                    {/* Botones Guardar / Cancelar */}
                    <div className="flex gap-2 justify-end">
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </div>
                </div>
            ) : (
                // === MODO LECTURA ===
                <div className="flex items-center gap-4">
                    {/* Drag handle */}
                    <div
                        className="cursor-grab px-2 select-none text-sm bg-gray-700 text-white rounded w-fit"
                        ref={setActivatorNodeRef}
                        {...attributes}
                        {...listeners}
                    >
                        ☰
                    </div>

                    {/* Imagen (si existe) */}
                    {link.image && (
                        <img
                            src={link.image}
                            alt={link.title}
                            className="w-10 h-10 object-cover rounded"
                        />
                    )}

                    {/* Info */}
                    <div>
                        <div className="font-semibold">{link.title}</div>
                        <div className="text-xs text-gray-400">{link.url}</div>
                    </div>

                    {/* Espaciador */}
                    <div className="flex-1" />

                    {/* Toggle Visible + Botón Editar */}
                    <div className="flex items-center gap-2">
                        <Switch
                            className="
                data-[state=checked]:bg-green-500
                data-[state=unchecked]:bg-red-500
              "
                            checked={link.visible}
                            onCheckedChange={toggleVisible}
                        />
                        <Button onClick={() => setIsEditing(true)}>Editar</Button>
                    </div>
                </div>
            )}
        </li>
    );
}
