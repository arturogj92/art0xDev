"use client";

import { useEffect, useState } from "react";
import { LinkData, SectionData } from "./types";
import { CreationForm } from "./creation-form";
import SectionsPanel from "./sections-panel"; // Ajusta ruta
import MultiSectionsBoard from "./multi-sections-board"; // Ajusta ruta

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [newLink, setNewLink] = useState<Omit<LinkData, "id">>({
        title: "",
        url: "",
        image: "",
        visible: true,
        pinned: false,
        position: 0,
        section_id: null,
    });

    // Edición inline
    const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingUrl, setEditingUrl] = useState("");

    // =======================
    // ESTADO DE SECCIONES
    // =======================
    const [sections, setSections] = useState<SectionData[]>([]);

    // Cargar links y sections
    useEffect(() => {
        // Cargar links
        fetch("/api/links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setLinks(data);
                }
            })
            .catch((err) => console.error(err));

        // Cargar sections
        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSections(data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // =======================
    // FUNCIONES LINKS
    // =======================
    const handleCreate = async () => {
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLink),
            });
            const data = await res.json();

            if (res.ok) {
                setLinks((prev) => [...prev, data]);
                setNewLink({
                    title: "",
                    url: "",
                    image: "",
                    visible: true,
                    pinned: false,
                    position: 0,
                    section_id: null,
                });
            } else {
                console.error("Error al crear link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
            const data = await res.json();

            if (res.ok) {
                setLinks((prev) => prev.filter((l) => l.id !== id));
            } else {
                console.error("Error al eliminar link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateLink = async (id: string, updates: Partial<LinkData>) => {
        try {
            const res = await fetch("/api/links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updates }),
            });
            const data = await res.json();

            if (res.ok) {
                setLinks((prev) =>
                    prev.map((link) => (link.id === id ? { ...link, ...data } : link))
                );
            } else {
                console.error("Error al actualizar link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Edición inline
    const startEditing = (link: LinkData) => {
        setEditingLinkId(link.id);
        setEditingTitle(link.title);
        setEditingUrl(link.url);
    };

    const saveEditing = async (id: string) => {
        await handleUpdateLink(id, { title: editingTitle, url: editingUrl });
        setEditingLinkId(null);
        setEditingTitle("");
        setEditingUrl("");
    };

    const cancelEditing = () => {
        setEditingLinkId(null);
        setEditingTitle("");
        setEditingUrl("");
    };

    // Reordenar no pinned
    const handleReorder = async (newLinks: LinkData[]) => {
        // pinned primero
        const pinned = links.filter((l) => l.pinned).sort((a, b) => a.position - b.position);
        const combined = [...pinned, ...newLinks];
        setLinks(combined);

        const updates = newLinks.map((l) => ({ id: l.id, position: l.position }));
        try {
            await fetch("/api/links", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Separar pinned / normal
    const pinnedLinks = links
        .filter((l) => l.pinned)
        .sort((a, b) => a.position - b.position);

    const normalLinks = links
        .filter((l) => !l.pinned)
        .sort((a, b) => a.position - b.position);

    // =======================
    // RENDER
    // =======================
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración (Editables)</h1>

            {/* Formulario para crear enlaces */}
            <CreationForm
                newLink={newLink}
                setNewLink={setNewLink}
                onCreate={handleCreate}
                sections={sections} // <-- Para asignar section_id si deseas
            />

            {/* Lista de enlaces pinned */}
            {/*<PinnedList*/}
            {/*    pinnedLinks={pinnedLinks}*/}
            {/*    editingLinkId={editingLinkId}*/}
            {/*    editingTitle={editingTitle}*/}
            {/*    editingUrl={editingUrl}*/}
            {/*    setEditingTitle={setEditingTitle}*/}
            {/*    setEditingUrl={setEditingUrl}*/}
            {/*    onStartEditing={startEditing}*/}
            {/*    onSaveEditing={saveEditing}*/}
            {/*    onCancelEditing={cancelEditing}*/}
            {/*    onDelete={handleDelete}*/}
            {/*    onUpdateLink={handleUpdateLink}*/}
            {/*/>*/}

            {/* Lista de enlaces no pinned */}
            {/*<NonPinnedList*/}
            {/*    normalLinks={normalLinks}*/}
            {/*    editingLinkId={editingLinkId}*/}
            {/*    editingTitle={editingTitle}*/}
            {/*    editingUrl={editingUrl}*/}
            {/*    setEditingTitle={setEditingTitle}*/}
            {/*    setEditingUrl={setEditingUrl}*/}
            {/*    onStartEditing={startEditing}*/}
            {/*    onSaveEditing={saveEditing}*/}
            {/*    onCancelEditing={cancelEditing}*/}
            {/*    onDelete={handleDelete}*/}
            {/*    onUpdateLink={handleUpdateLink}*/}
            {/*    onReorder={handleReorder}*/}
            {/*/>*/}
            {/* Board para NO pinned, distribuidos en contenedores (no-section + secciones) */}
            <MultiSectionsBoard
                links={links}
                setLinks={setLinks}
                sections={sections}
            />

            {/* Panel para reordenar secciones (título, etc.) */}
            <SectionsPanel />

        </div>
    );
}
