// app/admin/page.tsx (AdminPage)
"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "@/app/admin/social-links-panel";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);

    useEffect(() => {
        // Cargar enlaces
        fetch("/api/links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setLinks(data);
                }
            })
            .catch((err) => console.error(err));

        // Cargar secciones
        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSections(data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    // Eliminar enlace
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

    // Actualizar enlace
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

    // Actualizar sección
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

    // Eliminar sección
    async function handleDeleteSection(id: string) {
        try {
            // 1. Buscar enlaces con section_id = id (en estado local)
            const linksToReassign = links.filter((l) => l.section_id === id);

            // 2. Reasignar en backend => poner section_id=null
            if (linksToReassign.length > 0) {
                const updates = linksToReassign.map((ln) => ({
                    id: ln.id,
                    section_id: null,
                }));

                // PATCH masivo
                const patchRes = await fetch("/api/links", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updates),
                });
                const patchData = await patchRes.json();
                if (!patchRes.ok) {
                    console.error("Error reasignando links en backend:", patchData.error);
                    // Podemos continuar o retornar, según quieras.
                }
            }

            // 3. Actualizar en el FRONT => para que aparezcan de inmediato en 'sin sección'
            setLinks((prev) =>
                prev.map((link) =>
                    link.section_id === id ? {...link, section_id: null} : link
                )
            );

            // 4. Borrar la sección en backend
            const res = await fetch(`/api/sections?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (!res.ok) {
                console.error("Error al eliminar sección:", data.error);
                return;
            }

            // 5. Quitar la sección del estado local
            setSections((prev) => prev.filter((sec) => sec.id !== id));
        } catch (error) {
            console.error("Error al eliminar sección:", error);
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
