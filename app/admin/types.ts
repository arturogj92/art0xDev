// app/admin/types.ts

export interface LinkData {
    id: string;
    title: string;
    url: string;
    image?: string;
    visible: boolean;
    pinned: boolean;
    position: number;
    section_id?: string | null;
}

export interface SectionData {
    id: string;
    title: string;
    position: number;
}
