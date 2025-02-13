import Header from "@/components/header";
import SocialLinks from "@/components/SocialLinks";
import Section from "@/components/section";
import LinkButton from "@/components/link-button";

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black to-fuchsia-950 p-4">
        {/* Encabezado con tu perfil */}
        <Header
            name="Art0xDev"
            role="Full Stack Dev"
            description="¡Aprende programación desde 0 conmigo!"
            profileImage="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3Byb2ZpbGUtaW1hZ2VzLzcyM2Q3MjU2LTU5MTMtNDA4Zi1hZTNiLTUyZDU2NDJhZDc4OC5qcGVnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoyMDB9fX0="  // Asegúrate de poner la ruta correcta a tu imagen
        />

        {/* Sección de Promociones y Colaboraciones */}
        <Section title="Promociones y Colaboraciones">
          <LinkButton iconUrl="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3lSa2F0RWxVSHdSeFVMZzZZNmNTeFV4dm9QQncyM2pTYlRSWEZhYTRtRGsuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwfX19" title="Conviértete en desarrollador en tan sólo 18 semanas con 4geeks Academy" url="https://curso-java.com" />
          <LinkButton iconUrl="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3lSa2F0RWxVSHdSeFVMZzZZNmNTeFV4dm9QQncyM2pTYlRSWEZhYTRtRGsuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwfX19" title="Conviértete en desarrollador en tan sólo 18 semanas con 4geeks Academy" url="https://curso-java.com" />
        </Section>

        {/* Sección de Cursos Gratis */}
        <Section title="Mis Cursos Gratis">
          <LinkButton iconUrl="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3lSa2F0RWxVSHdSeFVMZzZZNmNTeFV4dm9QQncyM2pTYlRSWEZhYTRtRGsuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwfX19" title="Conviértete en desarrollador en tan sólo 18 semanas con 4geeks Academy" url="https://curso-java.com" />
        </Section>

        {/* Sección de Extensiones y Herramientas Útiles */}
        <Section title="Extensiones y Herramientas Útiles">
            <LinkButton iconUrl="https://cdn.campsite.bio/eyJidWNrZXQiOiJjYW1wc2l0ZS1iaW8tc3RvcmFnZSIsImtleSI6Im1lZGlhL3lSa2F0RWxVSHdSeFVMZzZZNmNTeFV4dm9QQncyM2pTYlRSWEZhYTRtRGsuanBlZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTUwfX19" title="Conviértete en desarrollador en tan sólo 18 semanas con 4geeks Academy" url="https://curso-java.com" />
        </Section>
        <SocialLinks />
        {/*<ModeToggle/>*/}
      </div>
  );
}