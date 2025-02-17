"use client";

import { useEffect, useState } from "react";
import { LinkData, SectionData } from "./types";
import { CreationForm } from "./creation-form";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "@/app/admin/social-links-panel";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);

    // Estado para crear link
    const [newLink, setNewLink] = useState<Omit<LinkData, "id">>({
        title: "",
        url: "",
        image: "",
        visible: true,
        pinned: false,
        position: 0,
        section_id: null,
    });

    // Carga inicial
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


    async function handleUpdateLink(id: string, updates: Partial<LinkData>) {
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
                console.error("Error updating link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // ========== CREAR LINK ==========
    async function handleCreate() {
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
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración (Editables)</h1>

            {/* Formulario para crear enlaces */}
            <CreationForm
                newLink={newLink}
                setNewLink={setNewLink}
                onCreate={handleCreate}
                sections={sections}
            />

            {/* Board para reordenar enlaces (drag & drop) */}
            <MultiSectionsBoard
                links={links}
                setLinks={setLinks}
                sections={sections}
                setSections={setSections}
                onUpdateLink={handleUpdateLink}
            />

            <SocialLinksPanel />
        </div>
    );
}
