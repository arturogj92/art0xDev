"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {LinkData} from "./types";

/** Iconos pequeños para cada campo */
function TitleIcon() {
    return (
        <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25h15M4.5 12h9m-9 3.75h15"/>
        </svg>
    );
}

function LinkIcon() {
    return (
        <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6.75h3.75a2.25 2.25 0 0 1
           2.25 2.25v6a2.25 2.25 0 0 1-2.25
           2.25H13.5m-3 0H6.75a2.25 2.25 0 0
           1-2.25-2.25v-6a2.25 2.25 0 0
           1 2.25-2.25H10.5"
            />
        </svg>
    );
}

function ImageIcon() {
    return (
        <svg
            className="w-4 h-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a2.25 2.25 0 0 0
           2.25 2.25h15a2.25 2.25 0 0 0
           2.25-2.25V6.75a2.25 2.25 0 0 0
           -2.25-2.25h-15A2.25 2.25 0 0 0
           2.25 6.75v8.25ZM6 9.75a.75.75 0
           1 0 0-1.5.75.75 0 0 0 0
           1.5Zm3.75 4.5 1.5-1.5 2.25
           2.25 3-3 2.25 2.25"
            />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788
           0L9.26 9m9.968-3.21c.342.052.682.107
           1.022.166m-1.022-.165L18.16
           19.673A2.25 2.25 0 0 1
           15.916 21H8.084a2.25 2.25 0 0 1
           -2.244-2.077L4.772 5.79m14.456
           0a48.108 48.108 0 0 0-3.478-.397M4.75
           5.75h14.5"
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
    // Drag & drop
    const {
        setNodeRef,
        setActivatorNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({id: link.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: isDragging ? "rgba(255,255,255,0.1)" : "transparent",
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Estado local (modo edición permanente)
    const [title, setTitle] = useState(link.title);
    const [url, setUrl] = useState(link.url);
    const [image, setImage] = useState(link.image ?? "");

    function handleTitleChange(val: string) {
        setTitle(val);
        onUpdateLink(link.id, {title: val});
    }

    function handleUrlChange(val: string) {
        setUrl(val);
        onUpdateLink(link.id, {url: val});
    }

    function handleImageChange(val: string) {
        setImage(val);
        onUpdateLink(link.id, {image: val});
    }
    function toggleVisible(checked: boolean) {
        onUpdateLink(link.id, { visible: checked });
    }

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
        flex
        gap-3
      "
        >
            {/* Drag handle a la izquierda (centrado verticalmente) */}
            <div
                className="
          cursor-grab
          px-2
          select-none
          text-sm
          bg-gray-700
          text-white
          rounded
          self-center
          h-fit
        "
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
            >
                ☰
            </div>

            {/* Contenedor principal con layout de grid para 2 filas y 2 columnas
          (Título + URL en la 1ra columna, la imagen en la 2da col y abarca 2 filas).
          Luego Input de imagen en 3ra fila y footer con toggle + borrar en la 4ta */}
            <div className="flex-1 flex flex-col gap-2">
                {/* Grid con 2 filas (title + url) y 2 columnas (inputs vs imagen) */}
                <div className="grid grid-cols-[1fr_auto] gap-2">
                    {/* -- Filas 1 y 2 para Título y URL -- */}
                    <div className="flex flex-col gap-2">
                        {/* Título */}
                        <div className="flex items-center gap-1 w-full">
                            <TitleIcon/>
                            <Input
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Título"
                                className="w-full text-sm px-2 py-1"
                            />
                        </div>
                        {/* URL */}
                        <div className="flex items-center gap-1 w-full">
                            <LinkIcon/>
                            <Input
                                value={url}
                                onChange={(e) => handleUrlChange(e.target.value)}
                                placeholder="URL"
                                className="w-full text-sm px-2 py-1"
                            />
                        </div>
                    </div>

                    {/* Imagen: abarca row-span-2 para ocupar el alto de Título+URL */}
                    <div className="row-span-2 flex items-center justify-center">
                        {image ? (
                            <img
                                src={image}
                                alt={title}
                                className="max-h-[5rem] w-auto object-cover rounded"
                            />
                        ) : (
                            <div className="text-xs text-gray-500 italic">Sin imagen</div>
                        )}
                    </div>
                </div>

                {/* 3er input => Imagen (URL) */}
                <div className="flex items-center gap-1 w-full">
                    <ImageIcon/>
                    <Input
                        value={image}
                        onChange={(e) => handleImageChange(e.target.value)}
                        placeholder="URL de la imagen"
                        className="w-full text-sm px-2 py-1"
                    />
                </div>

                {/* Footer => Toggle Visible + Botón Borrar */}
                <div className="flex items-center justify-between mt-1">
                    {/* Toggle Visible a la izquierda */}
                    <div className="flex items-center gap-2">
                        <Switch
                            className="
                data-[state=checked]:bg-green-500
                data-[state=unchecked]:bg-red-500
              "
                            checked={link.visible}
                            onCheckedChange={toggleVisible}
                        />
                        <span className="text-xs">Visible</span>
                    </div>

                    {/* Botón Borrar a la derecha */}
                    <Button
                        variant="destructive"
                        onClick={handleDeleteClick}
                        className="text-xs px-2 py-1"
                    >
                        <TrashIcon/>
                    </Button>
                </div>
            </div>

            {/* Modal de borrado */}
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
