// app/admin/CreationForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LinkData, SectionData } from "./types";

interface CreationFormProps {
    newLink: Omit<LinkData, "id">;
    setNewLink: (val: Omit<LinkData, "id">) => void;
    onCreate: () => void;
    sections: SectionData[]; // <-- Lista de secciones para asignar section_id
}

export function CreationForm({
                                 newLink,
                                 setNewLink,
                                 onCreate,
                                 sections,
                             }: CreationFormProps) {
    return (
        <div className="border p-4 mb-8 space-y-2">
            <h2 className="font-semibold">Crear Enlace</h2>
            <Input
                placeholder="Título"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
            />
            <Input
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <Input
                placeholder="Imagen (URL)"
                value={newLink.image || ""}
                onChange={(e) => setNewLink({ ...newLink, image: e.target.value })}
            />

            <div className="flex items-center gap-2">
                <label className="text-sm">Visible:</label>
                <Switch
                    checked={newLink.visible}
                    onCheckedChange={(checked) =>
                        setNewLink({ ...newLink, visible: checked })
                    }
                />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm">Pinned:</label>
                <Switch
                    checked={newLink.pinned}
                    onCheckedChange={(checked) =>
                        setNewLink({ ...newLink, pinned: checked })
                    }
                />
            </div>

            {/* SELECT DE SECCIONES */}
            <div className="flex items-center gap-2">
                <label className="text-sm">Sección:</label>
                <select
                    className="border rounded p-1"
                    value={newLink.section_id || ""}
                    onChange={(e) =>
                        setNewLink({
                            ...newLink,
                            section_id: e.target.value === "" ? null : e.target.value,
                        })
                    }
                >
                    <option value="">(Sin sección)</option>
                    {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                            {sec.title}
                        </option>
                    ))}
                </select>
            </div>

            <Button onClick={onCreate}>Crear</Button>
        </div>
    );
}
