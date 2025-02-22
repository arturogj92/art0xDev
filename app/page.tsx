// app/page.tsx
import {supabaseAdmin} from "@/lib/supabase";
import {LinkData, SectionData} from "./admin/types";
import LandingPreview from "@/app/landing-content";

export default async function Home() {
    // Cargar secciones
    const { data: sectionsData, error: secError } = await supabaseAdmin
        .from("sections")
        .select("*")
        .order("position", { ascending: true });

    // Cargar enlaces
    const { data: linksData, error: linksError } = await supabaseAdmin
        .from("links")
        .select("*")
        .order("position", {ascending: true});

    // Manejo de errores
    if (secError) console.error("Error fetching sections:", secError.message);
    if (linksError) console.error("Error fetching links:", linksError.message);

    const sections = (sectionsData as SectionData[]) || [];
    const links = (linksData as LinkData[]) || [];

    return (
        <div className="bg-gradient-to-b">
            <LandingPreview sections={sections} links={links}/>
        </div>
    );
}
