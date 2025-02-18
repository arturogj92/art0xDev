// app/admin/preview/page.tsx
import {supabaseAdmin} from "@/lib/supabase"; // Ajusta la ruta a tu helper
import Header from "@/components/header";
import Section from "@/components/section";
import LinkButton from "@/components/link-button";
import SocialLinks from "@/components/SocialLinks";
import {LinkData, SectionData} from "@/app/admin/types"; // Ajusta la ruta si difiere

export const revalidate = 0;
// Con esto te aseguras de que Next no intente hacer caching en producción

export default async function AdminPreviewPage() {
    // 1. Cargar secciones
    const {data: sectionsData, error: secError} = await supabaseAdmin
        .from("sections")
        .select("*")
        .order("position", {ascending: true});

    // 2. Cargar enlaces
    const {data: linksData, error: linksError} = await supabaseAdmin
        .from("links")
        .select("*")
        .order("position", {ascending: true});

    if (secError) {
        console.error("Error fetching sections:", secError.message);
    }
    if (linksError) {
        console.error("Error fetching links:", linksError.message);
    }

    const sections = (sectionsData as SectionData[]) || [];
    const links = (linksData as LinkData[]) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-fuchsia-950 p-4">
            <Header
                name="Art0xDev"
                role="Full Stack Dev"
                description="¡Aprende programación desde 0 conmigo!"
                profileImage="https://cdn.campsite.bio/..."
            />

            {sections.map((sec) => {
                const secLinks = links.filter(
                    (l) => l.section_id === sec.id && l.visible
                );

                if (secLinks.length === 0) return null;

                return (
                    <Section key={sec.id} title={sec.title}>
                        {secLinks.map((link) => (
                            <LinkButton
                                key={link.id}
                                iconUrl={link.image || ""}
                                title={link.title}
                                url={link.url}
                            />
                        ))}
                    </Section>
                );
            })}

            <SocialLinks/>
        </div>
    );
}
