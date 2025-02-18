// app/admin/page.tsx
"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "./social-links-panel";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        fetch("/api/links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setLinks(data);
            })
            .catch((err) => console.error(err));

        fetch("/api/sections")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setSections(data);
            })
            .catch((err) => console.error(err));
    }, []);

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
            const linksToReassign = links.filter((l) => l.section_id === id);
            if (linksToReassign.length > 0) {
                const updates = linksToReassign.map((ln) => ({
                    id: ln.id,
                    section_id: null,
                }));
                const patchRes = await fetch("/api/links", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updates),
                });
                const patchData = await patchRes.json();
                if (!patchRes.ok) {
                    console.error("Error reasignando links en backend:", patchData.error);
                }
            }
            setLinks((prev) =>
                prev.map((link) =>
                    link.section_id === id ? {...link, section_id: null} : link
                )
            );
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Panel izquierdo */}
            <div className="md:w-[56.666%] p-4 border-b md:border-b-0 md:border-r border-gray-600">
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
                    // onLinksReordered={() => setRefreshCount((c) => c + 1)} // Si quieres refrescar la preview al mover
                />

                <SocialLinksPanel/>
            </div>

            {/* Panel derecho */}
            <div className="
        flex-[13]
        bg-black
        md:sticky
        md:top-0
        h-screen
        flex flex-col
        items-center
        justify-center
      "
            >
                <div className="text-white p-2 rounded mb-4 w-full text-center">
                    <p className="font-bold">PREVIEW</p>
                </div>

                {/*
          Contenedor para mostrar la imagen 590x1196 a la mitad => 295x598
          con scale=1 (si quieres tal cual), o “real” => 590x1196 con scale=0.5
          Lo importante es que "coincidan" contenedor e imagen.
        */}
                <div
                    className="
            relative
            w-[300px]  /* mitad de 590 */
            h-[598px]  /* mitad de 1196 */
            /* si quieres ajustarlo más grande/pequeño, puedes scale o cambiar w/h */
            scale-[1] /* mitad de 1 */
          "
                >
                    {/* Imagen iPhone => 590x1196 (metida a la mitad) */}
                    <img
                        src="/images/iphone16-frame.png"
                        alt="iPhone frame"
                        className="absolute w-full h-full z-20 pointer-events-none"
                    />

                    {/*
            "Pantalla" interna.
            Ajusta top, left, width, height a la mitad también.
            Ej: supongamos la pantalla real está a top=100, left=20 y mide 550x1000
            => la mitad es top=50, left=10, w=275, h=500
            Esto es un ejemplo, tendrás que ir probando.
          */}
                    <div
                        className="
              absolute
              top-[5px]   /* EJEMPLO, la mitad de 120 */
              left-[0px]  /* EJEMPLO, la mitad de 30 */
              w-[300px]    /* EJEMPLO, la mitad de 530 */
              h-[598px]    /* EJEMPLO, la mitad de 1000 */
              z-10
              pt-4
              pb-4
              overflow-y-auto
              bg-black
              rounded-[80px] /* para redondear esquinas */
            "
                    >
                        <iframe
                            key={refreshCount}
                            src={`/?r=${refreshCount}`}
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}