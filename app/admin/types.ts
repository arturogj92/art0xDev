// app/admin/types.ts

export interface SocialLinkData {
    id: string;         // identificador único
    name: string;       // "instagram" | "twitter" | "youtube" | "tiktok" | "github" | "linkedin"
    url: string;        // URL a la que apunta
    visible: boolean;   // mostrar/ocultar
    position: number;   // para el orden
}

export interface LinkData {
    id: string;
    title: string;
    url: string;
    image?: string;
    visible: boolean;
    position: number;
    section_id?: string | null;
}

export interface SectionData {
    id: string;
    title: string;
    position: number;
}
