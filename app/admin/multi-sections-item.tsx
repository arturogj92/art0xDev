"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React, {useRef, useState} from "react";
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

    // Referencia al input "file" oculto
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleTitleChange(val: string) {
        setTitle(val);
        onUpdateLink(link.id, {title: val});
    }

    function handleUrlChange(val: string) {
        setUrl(val);
        onUpdateLink(link.id, {url: val});
    }

    // -- Subir imagen => envía a /api/images
    async function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        // Convertir a Base64
        const reader = new FileReader();
        reader.onload = async () => {
            const fullBase64 = reader.result as string;  // "data:image/png;base64,AAAA..."

            // 1. Separar la cabecera ("data:...base64,") del contenido real
            const splitted = fullBase64.split(","); // splitted[0] = "data:image/png;base64"
            // splitted[1] = "AAAA..."
            const pureBase64 = splitted[1];        // la parte pura

            try {
                const res = await fetch("/api/images", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        base64: pureBase64, // <--- solo la parte base64
                    }),
                });
                const data = await res.json();
                if (!res.ok) {
                    console.error("Error al subir imagen:", data.error);
                    return;
                }
                // data.url => la URL pública devuelta
                setImage(data.url);
                onUpdateLink(link.id, {image: data.url});
            } catch (error) {
                console.error("Error al subir imagen:", error);
            }
        };
        reader.readAsDataURL(file);
    }

    function handleUploadClick() {
        // Dispara el click del file input
        fileInputRef.current?.click();
    }

    function handleRemoveImage() {
        // Podrías llamar a DELETE /api/images?fileName=xxx si quisieras borrarla del server
        setImage("");
        onUpdateLink(link.id, {image: ""});
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

            {/* Contenedor principal */}
            <div className="flex-1 flex flex-col gap-2">
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

                {/* Imagen */}
                <div className="flex items-center gap-2">
                    {/* Botón "Subir Imagen" / "Quitar" */}
                    <div className="flex flex-col">
                        {image ? (
                            <img
                                src={image}
                                alt={title}
                                className="max-h-[5rem] w-auto object-cover rounded"
                            />
                        ) : (
                            <div
                                className="text-xs text-gray-500 italic w-20 h-10 flex items-center justify-center border border-gray-400 rounded">
                                Sin imagen
                            </div>
                        )}
                        <div className="flex gap-1 mt-1">
                            {!image && (
                                <Button variant="secondary" size="sm" onClick={handleUploadClick}>
                                    Subir
                                </Button>
                            )}
                            {image && (
                                <Button variant="secondary" size="sm" onClick={handleRemoveImage}>
                                    Quitar
                                </Button>
                            )}
                        </div>
                        {/* Input oculto */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleSelectFile}
                            className="hidden"
                        />
                    </div>
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
