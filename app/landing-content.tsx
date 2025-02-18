// app/admin/landing-preview.tsx

"use client";

import {LinkData, SectionData} from "./admin/types";
import Header from "@/components/header";
import Section from "@/components/section";
import LinkButton from "@/components/link-button";
import SocialLinks from "@/components/SocialLinks";

interface LandingPreviewProps {
    sections: SectionData[];
    links: LinkData[];
}

/**
 * Este componente muestra la "landing" dentro del admin,
 * intentando ajustarse mejor a resoluciones pequeñas (ej. 320px de ancho).
 */
export default function LandingPreview({sections, links}: LandingPreviewProps) {
    return (
        <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-black to-fuchsia-950 min-h-[500px] p-4">
            <Header
                name="Art0xDev"
                role="Full Stack Dev"
                description="¡Aprende programación desde 0 conmigo!"
                profileImage="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3Byb2ZpbGUtaW1hZ2VzLzcyM2Q3MjU2LTU5MTMtNDA4Zi1hZTNiLTUyZDU2NDJhZDc4OC5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoyMDB9fX0="
            />

            {/* Secciones con sus enlaces visibles */}
            {sections.map((sec) => {
                // Filtrar y ordenar enlaces de la sección
                const secLinks = links
                    .filter((l) => l.section_id === sec.id && l.visible)
                    .sort((a, b) => a.position - b.position);

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
