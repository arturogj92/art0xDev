"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { SectionData } from "./types";

interface SectionsPanelItemProps {
  section: SectionData; // <-- nombre EXACTO
  onDeleteSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<SectionData>) => void;
}

export default function SectionsPanelItem({
                                            section,
                                            onDeleteSection,
                                            onUpdateSection,
                                          }: SectionsPanelItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id }); // <-- "section.id" no será undefined si "section" existe

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "rgba(255,255,255,0.1)" : "transparent",
  };

  const handleRename = () => {
    const newTitle = prompt("Nuevo título de la sección:", section.title);
    if (newTitle && newTitle.trim() !== "") {
      onUpdateSection(section.id, { title: newTitle.trim() });
    }
  };

  return (
      <li
          ref={setNodeRef}
          style={style}
          className="flex items-center justify-between p-2 border rounded"
      >
        <div
            className="cursor-grab px-2 select-none text-sm bg-gray-700 text-white rounded mr-2"
            {...attributes}
            {...listeners}
        >
          ☰
        </div>
        <div className="flex-1">
          <div className="font-semibold">{section.title}</div>
        </div>
        <Button variant="secondary" onClick={handleRename}>
          Renombrar
        </Button>
        <Button variant="destructive" onClick={() => onDeleteSection(section.id)}>
          Eliminar
        </Button>
      </li>
  );
}
