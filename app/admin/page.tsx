// app/admin/page.tsx
"use client";

import {useEffect, useState} from "react";
import {LinkData, SectionData} from "./types";
import MultiSectionsBoard from "./multi-sections-board";
import SocialLinksPanel from "./social-links-panel";

const LandingIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-10"
        >
            <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751
           3 3 0 0 0-5.305 0 3 3 0 0 0-3.751
           3.75 3 3 0 0 0 0 5.305 3 3 0 0 0
           3.75 3.751 3 3 0 0 0 5.305 0
           3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75
           0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75
           0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0
           1.137-.089l4-5.5Z"
                clipRule="evenodd"
            />
        </svg>
    );
};

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
                prev.map((link) => (link.section_id === id ? {...link, section_id: null} : link))
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
                <div className="flex items-center">
                    <LandingIcon/>
                    <h1 className="text-2xl font-bold mb-4 pt-3 pl-2">Art0xDev Landing</h1>
                </div>

                <MultiSectionsBoard
                    links={links}
                    setLinks={setLinks}
                    sections={sections}
                    setSections={setSections}
                    onUpdateLink={handleUpdateLink}
                    onDeleteLink={handleDeleteLink}
                    onUpdateSection={handleUpdateSection}
                    onDeleteSection={handleDeleteSection}
                    onLinksReordered={() => setRefreshCount((c) => c + 1)}
                />

                <SocialLinksPanel onReorder={() => setRefreshCount((c) => c + 1)}/>
            </div>

            {/* Panel derecho => la preview */}
            <div
                className="
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

                <div
                    className="
            relative
            w-[300px]
            h-[598px]
            scale-[1]
          "
                >
                    {/* iPhone image => 590x1196 scaled to half */}
                    <img
                        src="/images/iphone16-frame.png"
                        alt="iPhone frame"
                        className="absolute w-full h-full z-20 pointer-events-none"
                    />
                    <div
                        className="
              absolute
              top-[5px]
              left-[0px]
              w-[300px]
              h-[598px]
              z-10
              pt-4
              pb-4
              overflow-y-auto
              bg-black
              rounded-[80px]
            "
                    >
                        {/* Refresh with ?r=refreshCount */}
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
