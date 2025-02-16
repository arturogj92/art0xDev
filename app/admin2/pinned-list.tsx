"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LinkData } from "./types";

interface PinnedListProps {
    pinnedLinks: LinkData[];
    editingLinkId: string | null;
    editingTitle: string;
    editingUrl: string;
    setEditingTitle: (val: string) => void;  // <--
    setEditingUrl: (val: string) => void;    // <--
    onStartEditing: (link: LinkData) => void;
    onSaveEditing: (id: string) => void;
    onCancelEditing: () => void;
    onDelete: (id: string) => void;
    onUpdateLink: (id: string, updates: Partial<LinkData>) => void;
}

export function PinnedList({
                               pinnedLinks,
                               editingLinkId,
                               editingTitle,
                               editingUrl,
                               setEditingTitle,
                               setEditingUrl,
                               onStartEditing,
                               onSaveEditing,
                               onCancelEditing,
                               onDelete,
                               onUpdateLink,
                           }: PinnedListProps) {
    return (
        <div className="mb-8">
            <h2 className="font-semibold mb-2">Enlaces Pinned (sin drag)</h2>
            <ul className="space-y-2">
                {pinnedLinks.map((link) => {
                    const isEditing = editingLinkId === link.id;

                    return (
                        <li
                            key={link.id}
                            className="flex items-center justify-between p-2 border rounded"
                        >
                            {isEditing ? (
                                <div className="flex-1 flex flex-col gap-2">
                                    <Input
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                    />
                                    <Input
                                        value={editingUrl}
                                        onChange={(e) => setEditingUrl(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    {link.image && (
                                        <img
                                            src={link.image}
                                            alt={link.title}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <div className="font-semibold">{link.title}</div>
                                        <div className="text-sm text-gray-600">{link.url}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <label className="text-sm">Visible</label>
                                    <Switch
                                        className="
                      data-[state=checked]:bg-green-500
                      data-[state=unchecked]:bg-red-500
                    "
                                        checked={link.visible}
                                        onCheckedChange={(checked) =>
                                            onUpdateLink(link.id, { visible: checked })
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <label className="text-sm">Pinned</label>
                                    <Switch
                                        className="
                      data-[state=checked]:bg-green-500
                      data-[state=unchecked]:bg-red-500
                    "
                                        checked={link.pinned}
                                        onCheckedChange={(checked) =>
                                            onUpdateLink(link.id, { pinned: checked })
                                        }
                                    />
                                </div>

                                {isEditing ? (
                                    <>
                                        <Button variant="secondary" onClick={() => onSaveEditing(link.id)}>
                                            Guardar
                                        </Button>
                                        <Button variant="destructive" onClick={onCancelEditing}>
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="secondary" onClick={() => onStartEditing(link)}>
                                            Editar
                                        </Button>
                                        <Button variant="destructive" onClick={() => onDelete(link.id)}>
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
