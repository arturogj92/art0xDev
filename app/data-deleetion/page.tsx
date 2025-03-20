// app/data-deletion/page.tsx
"use client";

export default function DataDeletionPage() {
    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6 text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Data Deletion Policy</h1>

            <p>
                Esta aplicación no almacena ni conserva datos personales de los usuarios
                en nuestros servidores. Toda la información procesada por la aplicación
                se utiliza de forma temporal para automatizar respuestas a comentarios y
                no se guarda de manera permanente.
            </p>

            <p>
                Por lo tanto, no tenemos datos que podamos eliminar manualmente, dado que
                no se guardan registros de usuario ni información sensible.
            </p>

            <p>
                <strong>¿Quieres revocar el acceso?</strong>
                <br/>
                Si deseas revocar el acceso de la aplicación a tu cuenta de Facebook,
                puedes hacerlo desde la configuración de tu cuenta de Facebook en
                <em> Configuración &gt; Seguridad &gt; Apps y sitios web </em>, y
                eliminar la aplicación de tus integraciones.
            </p>

            <p>
                Para cualquier duda o inquietud, escríbenos a{" "}
                <a
                    href="mailto:soporte@example.com"
                    className="underline text-blue-300 hover:text-blue-400"
                >
                    elcaminodelprogramadorweb@gmail.com
                </a>
                .
            </p>
        </main>
    );
}
