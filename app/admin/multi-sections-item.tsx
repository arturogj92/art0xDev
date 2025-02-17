"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {LinkData} from "./types";


function PencilIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
             className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
        </svg>

    );
}

function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
             className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
        </svg>
    );
}

interface MultiSectionsItemProps {
    link: LinkData;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
    onDeleteLink: (id: string) => void;
}

export default function MultiSectionsItem({
                                              link,
                                              onUpdateLink,
                                              onDeleteLink,
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

    const [editTitle, setEditTitle] = useState(link.title);
    const [editUrl, setEditUrl] = useState(link.url);
    const [editImage, setEditImage] = useState(link.image ?? "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleDeleteClick() {
        setShowDeleteModal(true);
    }

    function confirmDelete() {
        setShowDeleteModal(false);
        onDeleteLink(link.id);
    }

    function cancelDelete() {
        setShowDeleteModal(false);
    }

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
                        <Button onClick={() => setIsEditing(true)}>
                            <PencilIcon/>
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteClick}>
                            <TrashIcon/>
                        </Button>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-black p-4 rounded shadow">
                        <p className="mb-4">¿Seguro que deseas borrar este enlace?</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={cancelDelete}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Borrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}
