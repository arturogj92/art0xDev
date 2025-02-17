"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "@/app/admin/social-links-panel";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);

    useEffect(() => {
        fetch("/api/links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setLinks(data);
                }
            })
            .catch((err) => console.error(err));

        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSections(data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    async function handleDeleteLink(id: string) {
        try {
            const res = await fetch(`/api/links?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (res.ok) {
                setLinks((prev) => prev.filter((l) => l.id !== id));
            } else {
                console.error("Error al eliminar link:", data.error);
            }
        } catch (error) {
            console.error("Error al eliminar link:", error);
        }
    }

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

    async function handleUpdateSection(id: string, updates: Partial<SectionData>) {
        try {
            const res = await fetch("/api/sections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id, ...updates}),
            });
            const data = await res.json();
            if (res.ok) {
                setSections((prev) =>
                    prev.map((sec) => (sec.id === id ? {...sec, ...data} : sec))
                );
            } else {
                console.error("Error al actualizar sección:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteSection(id: string) {
        try {
            const res = await fetch(`/api/sections?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (res.ok) {
                setSections((prev) => prev.filter((sec) => sec.id !== id));
            } else {
                console.error("Error al eliminar sección:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración (Editables)</h1>

            <MultiSectionsBoard
                links={links}
                setLinks={setLinks}
                sections={sections}
                setSections={setSections}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
                onUpdateSection={handleUpdateSection}
                onDeleteSection={handleDeleteSection}
            />

            <SocialLinksPanel />
        </div>
    );
}
