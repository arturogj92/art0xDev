// app/page.tsx
import Header from "@/components/header";
import Section from "@/components/section";
import LinkButton from "@/components/link-button";
import SocialLinks from "@/components/SocialLinks";
import { supabaseAdmin } from "@/lib/supabase"; // Ajusta la ruta si tu archivo se llama distinto

export default async function Home() {
    // 1. Cargar secciones
    const { data: sectionsData, error: secError } = await supabaseAdmin
        .from("sections")
        .select("*")
        .order("position", { ascending: true });

    // 2. Cargar enlaces
    const { data: linksData, error: linksError } = await supabaseAdmin
        .from("links")
        .select("*")
        .order("position", { ascending: true }); // luego ordena por posición

    // Manejo de errores
    if (secError) {
        console.error("Error fetching sections:", secError.message);
    }
    if (linksError) {
        console.error("Error fetching links:", linksError.message);
    }

    const sections = sectionsData || [];
    const links = linksData || [];

    // Filtrar enlaces sin sección , y visibles
    const noSectionLinks = links.filter(
        (l) =>  !l.section_id && l.visible
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-fuchsia-950 p-4">
            <Header
                name="Art0xDev"
                role="Full Stack Dev"
                description="¡Aprende programación desde 0 conmigo!"
                profileImage="http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn.campsite.bio%2FeyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3Byb2ZpbGUtaW1hZ2VzLzcyM2Q3MjU2LTU5MTMtNDA4Zi1hZTNiLTUyZDU2NDJhZDc4OC5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoyMDB9fX0%3D&w=3840&q=75" // Ajusta la ruta de tu imagen
            />

            {/* SECCIÓN: Enlaces sin sección */}
            {noSectionLinks.length > 0 && (
                <Section title="Otros Enlaces">
                    {noSectionLinks.map((link) => (
                        <LinkButton
                            key={link.id}
                            iconUrl={link.image || ""}
                            title={link.title}
                            url={link.url}
                        />
                    ))}
                </Section>
            )}

            {/* SECCIONES: cada sección con sus enlaces */}
            {sections.map((sec) => {
                // Filtrar los enlaces de esta sección
                const secLinks = links.filter(
                    (l) => l.section_id === sec.id && l.visible
                );

                // Si no hay enlaces en la sección, podrías omitirla o mostrarla vacía
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

            <SocialLinks />
        </div>
    );
}
