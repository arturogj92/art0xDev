"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "./social-links-panel";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);

    // Para refrescar un <iframe> si lo deseas:
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        // Cargar enlaces
        fetch("/api/links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setLinks(data);
            })
            .catch((err) => console.error(err));

        // Cargar secciones
        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setSections(data);
            })
            .catch((err) => console.error(err));
    }, []);

    // ======= Funciones Links =======
    async function handleDeleteLink(id: string) {
        try {
            const res = await fetch(`/api/links?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (res.ok) {
                setLinks((prev) => prev.filter((l) => l.id !== id));
                setRefreshCount((c) => c + 1);
            } else {
                console.error("Error al eliminar link:", data.error);
            }
        } catch (error) {
            console.error(error);
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
                    prev.map((link) => (link.id === id ? {...link, ...data} : link))
                );
                setRefreshCount((c) => c + 1);
            } else {
                console.error("Error actualizando link:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // ======= Funciones Secciones =======
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
                setRefreshCount((c) => c + 1);
            } else {
                console.error("Error al actualizar sección:", data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteSection(id: string) {
        try {
            // Reasignar links => null
            const linksToReassign = links.filter((l) => l.section_id === id);
            if (linksToReassign.length > 0) {
                const updates = linksToReassign.map((ln) => ({id: ln.id, section_id: null}));
                const patchRes = await fetch("/api/links", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updates),
                });
                const patchData = await patchRes.json();
                if (!patchRes.ok) {
                    console.error("Error reasignando links:", patchData.error);
                }
            }
            setLinks((prev) =>
                prev.map((link) => (link.section_id === id ? {...link, section_id: null} : link))
            );

            // Borrar sección
            const res = await fetch(`/api/sections?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (!res.ok) {
                console.error("Error al eliminar sección:", data.error);
                return;
            }
            setSections((prev) => prev.filter((sec) => sec.id !== id));

            setRefreshCount((c) => c + 1);
        } catch (error) {
            console.error("Error al eliminar sección:", error);
        }
    }

    // ======= Render =======
    return (
        <div className="flex w-full">
            {/* Columna izquierda (scrollable) */}
            <div className="flex-[17] h-screen overflow-y-auto p-4 border-r border-gray-600">
                <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

                <MultiSectionsBoard
                    links={links}
                    setLinks={setLinks}
                    sections={sections}
                    setSections={setSections}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                    onUpdateSection={handleUpdateSection}
                    onDeleteSection={handleDeleteSection}
                    onLinksReordered={() => setRefreshCount((c) => c + 1)} // Forzar recarga iframe
                />

                <SocialLinksPanel/>
            </div>

            {/* Columna derecha (fija y centrada verticalmente) */}
            <div className="flex-[13] bg-black h-screen sticky top-0 flex flex-col items-center justify-center">
                <div className="text-white p-2 rounded mb-4 w-full text-center">
                    <p className="font-bold">PREVIEW</p>
                </div>

                {/* iPhone frame + iframe */}
                <div className="relative w-[330px] h-[550px] text-xs scale-90">
                    <img
                        src="/images/iphone16-frame.png"
                        alt="iPhone frame"
                        className="absolute w-full h-full z-20 pointer-events-none"
                    />
                    <div
                        className="absolute top-[12px] left-[5px] w-[320px] h-[530px] z-10 overflow-y-auto bg-black rounded-3xl">
                        <iframe
                            key={refreshCount}
                            src={`/?r=${refreshCount}`} // Para forzar recarga
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
