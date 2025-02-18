// app/admin/page.tsx

"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "./social-links-panel";
import LandingPreview from "../landing-content";

export default function AdminPage() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [sections, setSections] = useState<SectionData[]>([]);

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
                setLinks((prev) => prev.map((link) => (link.id === id ? {...link, ...data} : link)));
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
                setSections((prev) => prev.map((sec) => (sec.id === id ? {...sec, ...data} : sec)));
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
                const updates = linksToReassign.map((ln) => ({id: ln.id, section_id: null}));
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
            setLinks((prev) => prev.map((link) => (link.section_id === id ? {...link, section_id: null} : link)));
            const res = await fetch(`/api/sections?id=${id}`, {method: "DELETE"});
            const data = await res.json();
            if (!res.ok) {
                console.error("Error al eliminar sección:", data.error);
                return;
            }
            setSections((prev) => prev.filter((sec) => sec.id !== id));
        } catch (error) {
            console.error("Error al eliminar sección:", error);
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-600">
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
                />
                <SocialLinksPanel/>
            </div>
            <div className="md:w-1/2 p-4 bg-gray-900 flex flex-col items-center">
                <div className="bg-red-800 text-white p-2 rounded mb-4 w-full text-center">
                    <p className="font-bold">ESTO ES UNA PREVIEW</p>
                    <p className="text-sm">Así se verá tu landing</p>
                </div>
                <div className="relative w-[320] h-[540px]">
                    <img
                        src="/images/iphone16-frame.png"
                        alt="iPhone frame"
                        className="absolute w-full h-full z-20 pointer-events-none"
                    />
                    <div
                        className="absolute top-[12px] left-[16px] w-[286px] h-[510px] z-10 overflow-y-auto bg-black rounded-t-3xl rounded-b-3xl">
                        <LandingPreview sections={sections} links={links}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
