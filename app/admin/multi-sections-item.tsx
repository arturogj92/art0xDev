"use client";

import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import React, {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {LinkData} from "./types";

/** Iconos pequeños */
function EyeIcon() {
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
                d="M3.98 8.223C5.75 5.546 8.473 3.75 12 3.75s6.25 1.796 8.02 4.473a12.082 12.082 0 0 1 1.845 3.152.75.75 0 0 1 0 .75c-.47 1.016-1.1 1.996-1.845 3.152C18.25 18.454 15.527 20.25 12 20.25s-6.25-1.796-8.02-4.473a12.082 12.082 0 0 1-1.845-3.152.75.75 0 0 1 0-.75 12.082 12.082 0 0 1 1.845-3.152z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
            />
        </svg>
    );
}

function EyeSlashIcon() {
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
                d="M3.98 8.223C5.75 5.546 8.473 3.75 12 3.75c1.467 0 2.84.254 4.084.718M20.02
        8.223c.745 1.156 1.375 2.136 1.845 3.152a.75.75 0 0 1 0 .75 12.082 12.082 0 0 1-1.845
        3.152c-1.77 2.677-4.493 4.473-8.02 4.473-1.45 0-2.82-.25-4.06-.708M9.53 9.53l4.94
        4.94M9.53 14.47l4.94-4.94"
            />
        </svg>
    );
}

function TitleIcon() {
    return (
        <svg
            className="w-4 h-4 text-gray-400"
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
            className="w-4 h-4 text-gray-400"
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
            strokeWidth={1.5}
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

function CloseIcon() {
    return (
        <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
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

    // Estado "edición permanente"
    const [title, setTitle] = useState(link.title);
    const [url, setUrl] = useState(link.url);
    const [image, setImage] = useState(link.image ?? "");

    // Para subir imagen
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleTitleChange(val: string) {
        setTitle(val);
        onUpdateLink(link.id, {title: val});
    }
    function handleUrlChange(val: string) {
        setUrl(val);
        onUpdateLink(link.id, {url: val});
    }
    function toggleVisible(checked: boolean) {
        onUpdateLink(link.id, {visible: checked});
    }

    // Subir imagen => /api/images
    async function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            const fullBase64 = reader.result as string;
            const splitted = fullBase64.split(",");
            const pureBase64 = splitted[1];

            try {
                const res = await fetch("/api/images", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({base64: pureBase64}),
                });
                const data = await res.json();
                if (!res.ok) {
                    console.error("Error al subir imagen:", data.error);
                    return;
                }
                setImage(data.url);
                onUpdateLink(link.id, {image: data.url});
            } catch (error) {
                console.error("Error al subir imagen:", error);
            }
        };
        reader.readAsDataURL(file);
    }

    function handleUploadClick() {
        fileInputRef.current?.click();
    }
    function handleRemoveImage() {
        setImage("");
        onUpdateLink(link.id, {image: ""});
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
        relative
        border border-gray-500
        p-4
        rounded-2xl
        bg-black/40
        text-white
        min-h-[5rem]
      "
        >
            {/* HANDLE => arriba a la izquierda */}
            <div
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="
          absolute
          top-2
          left-2
          cursor-grab
          px-2
          text-sm
          bg-gray-700
          text-white
          rounded
        "
            >
                ☰
            </div>

            {/* ZONA SUPERIOR DERECHA => Toggle + Ojo y Papelera */}
            <div className="absolute top-2 right-2 flex items-center gap-2">
                {/* Toggle + icono ojo */}
                <div className="flex items-center gap-1">
                    <Switch
                        className="
              data-[state=checked]:bg-green-500
              data-[state=unchecked]:bg-red-500
            "
                        checked={link.visible}
                        onCheckedChange={toggleVisible}
                    />
                    {link.visible ? <EyeIcon/> : <EyeSlashIcon/>}
                </div>
                {/* Botón Borrar */}
                <Button variant="destructive" className="text-xs px-2 py-1" onClick={handleDeleteClick}>
                    <TrashIcon/>
                </Button>
            </div>

            {/* CONTENIDO principal => flex row: text fields en el centro, imagen a la derecha */}
            <div className="mt-8 flex items-start justify-between gap-4">
                {/* 1) Campos Título y URL */}
                <div className="flex flex-col gap-2 flex-1">
                    {/* Título con icono a la derecha */}
                    <div className="relative">
                        <Input
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Título"
                            className="w-full text-sm pr-8 px-2 py-1"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <TitleIcon/>
                        </div>
                    </div>
                    {/* URL con icono a la derecha */}
                    <div className="relative">
                        <Input
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="URL"
                            className="w-full text-sm pr-8 px-2 py-1"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <LinkIcon/>
                        </div>
                    </div>
                </div>

                {/* 2) Imagen (derecha) */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    {image ? (
                        <>
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover rounded"
                            />
                            {/* Botón X superpuesto */}
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="
                  absolute
                  top-1
                  right-1
                  bg-black/60
                  text-white
                  rounded-full
                  p-1
                  hover:bg-black/80
                "
                            >
                                <CloseIcon/>
                            </button>
                        </>
                    ) : (
                        <div
                            className="
                w-full
                h-full
                border-2 border-gray-400 border-dashed
                rounded
                flex
                flex-col
                items-center
                justify-center
                text-xs
                text-gray-500
                gap-1
              "
                        >
                            <span>Sin imagen</span>
                            <button
                                onClick={handleUploadClick}
                                className="
                  text-[10px]
                  bg-white/10
                  px-2
                  py-1
                  rounded
                  hover:bg-white/20
                "
                            >
                                Subir
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleSelectFile}
                        className="hidden"
                    />
                </div>
            </div>

            {/* MODAL de confirmación de borrado */}
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
