"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LinkData } from "./types";

// Interfaz de props
interface MultiSectionsItemProps {
    link: LinkData;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    // onUpdateLink vendrá del padre, para hacer el PATCH
}

export default function MultiSectionsItem({ link, onUpdateLink }: MultiSectionsItemProps) {
    // Lógica de arrastre (drag handle)
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

    // Estado local para "modo edición"
    const [isEditing, setIsEditing] = useState(false);

    // Estados locales para los campos a editar
    const [editTitle, setEditTitle] = useState(link.title);
    const [editUrl, setEditUrl] = useState(link.url);
    const [editImage, setEditImage] = useState(link.image ?? "");
    const [editVisible, setEditVisible] = useState(link.visible);
    const [editPinned, setEditPinned] = useState(link.pinned);

    // Función para guardar cambios
    function handleSave() {
        onUpdateLink(link.id, {
            title: editTitle,
            url: editUrl,
            image: editImage,
            visible: editVisible,
            pinned: editPinned,
        });
        setIsEditing(false);
    }

    // Función para cancelar y revertir
    function handleCancel() {
        setIsEditing(false);
        setEditTitle(link.title);
        setEditUrl(link.url);
        setEditImage(link.image ?? "");
        setEditVisible(link.visible);
        setEditPinned(link.pinned);
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="border p-2 rounded bg-white/10"
        >
            {/* Contenedor horizontal */}
            <div className="flex gap-2 items-center">
                {/* Contenido principal: modo edición o modo lectura */}
                {isEditing ? (
                    <div className="flex-1 flex flex-col gap-2">
                        {/* === MODO EDICIÓN === */}
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
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Visible:</label>
                            <Switch checked={editVisible} onCheckedChange={setEditVisible}/>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Pinned:</label>
                            <Switch checked={editPinned} onCheckedChange={setEditPinned}/>
                        </div>

                        {/* Botones Guardar / Cancelar */}
                        <div className="flex gap-2 justify-end">
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center gap-4">
                        {/* Drag handle */}
                        <div
                            className="cursor-grab px-2 select-none text-sm bg-gray-700 text-white rounded w-fit"
                            ref={setActivatorNodeRef}
                            {...attributes}
                            {...listeners}
                        >
                            ☰
                        </div>
                        {/* === MODO LECTURA === */}
                        {link.image && (
                            <img
                                src={link.image}
                                alt={link.title}
                                className="w-10 h-10 object-cover rounded"
                            />
                        )}
                        <div>
                            <div className="font-semibold">{link.title}</div>
                            <div className="text-xs text-gray-400">{link.url}</div>
                        </div>
                        <div className="ml-auto">
                            <Button onClick={() => setIsEditing(true)}>Editar</Button>
                        </div>
                    </div>
                )}
            </div>
        </li>

    );
}
