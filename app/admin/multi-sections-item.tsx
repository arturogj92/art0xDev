"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {LinkData} from "./types";

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9
           m9.968-3.21c.342.052.682.107 1.022.166
           m-1.022-.165L18.16 19.673
           A2.25 2.25 0 0 1 15.916 21H8.084
           a2.25 2.25 0 0 1-2.244-2.077
           L4.772 5.79m14.456 0
           a48.108 48.108 0 0 0-3.478-.397
           M4.75 5.75h14.5"
            />
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
    // DnDKit: configuración de arrastre
    const {
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({id: link.id});

    // Estilos de arrastre
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "rgba(255,255,255,0.07)" : "transparent",
    };

    // Estado para el modal de confirmación de borrado
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Campos editables (siempre en edición)
    const [editTitle, setEditTitle] = useState(link.title);
    const [editUrl, setEditUrl] = useState(link.url);
    const [editImage, setEditImage] = useState(link.image ?? "");

    // Al cambiar cualquier campo => onUpdate
    function handleChangeTitle(val: string) {
        setEditTitle(val);
        onUpdateLink(link.id, {title: val});
    }

    function handleChangeUrl(val: string) {
        setEditUrl(val);
        onUpdateLink(link.id, {url: val});
    }

    function handleChangeImage(val: string) {
        setEditImage(val);
        onUpdateLink(link.id, {image: val});
    }

    // Visibilidad => toggle
    function toggleVisible(checked: boolean) {
        onUpdateLink(link.id, { visible: checked });
    }

    // Borrar
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

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="
        border border-gray-500
        p-3
        rounded-2xl
        bg-black/40
        text-white
        flex flex-col gap-3
      "
        >
            {/* Sección superior: Drag handle + (opcional) preview imagen */}
            <div className="flex items-center gap-3">
                {/* Drag handle */}
                <div
                    className="
            cursor-grab
            px-2
            select-none
            text-sm
            bg-gray-700
            text-white
            rounded
          "
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                >
                    ☰
                </div>

                {/* (Opcional) Preview imagen si existe */}
                {link.image && (
                    <img
                        src={link.image}
                        alt={link.title}
                        className="w-10 h-10 object-cover rounded"
                    />
                )}
            </div>

            {/* Campo Título */}
            <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                    value={editTitle}
                    onChange={(e) => handleChangeTitle(e.target.value)}
                    className="mt-1"
                />
            </div>

            {/* Campo URL */}
            <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                    value={editUrl}
                    onChange={(e) => handleChangeUrl(e.target.value)}
                    className="mt-1"
                />
            </div>

            {/* Campo Imagen */}
            <div>
                <label className="text-sm font-medium">Imagen</label>
                <Input
                    value={editImage}
                    onChange={(e) => handleChangeImage(e.target.value)}
                    className="mt-1"
                />
            </div>

            {/* Pie: Toggle Visible a la IZQUIERDA + Botón Borrar a la derecha */}
            <div className="flex items-center justify-between mt-2">
                {/* Toggle en la izquierda */}
                <div className="flex items-center gap-2">
                    <Switch
                        className="
              data-[state=checked]:bg-green-500
              data-[state=unchecked]:bg-red-500
            "
                        checked={link.visible}
                        onCheckedChange={toggleVisible}
                    />
                    <span className="text-sm">Visible</span>
                </div>

                {/* Botón borrar */}
                <Button variant="destructive" onClick={handleDeleteClick}>
                    <TrashIcon/>
                </Button>
            </div>

            {/* Modal confirmación de borrado */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-black w-full max-w-sm mx-auto p-4 rounded shadow-lg">
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
