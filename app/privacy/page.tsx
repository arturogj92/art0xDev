// app/privacy/page.tsx
"use client";

export default function PrivacyPage() {
    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6 text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>

            <p>
                Esta aplicación se utiliza para responder automáticamente a comentarios
                en redes sociales. No almacenamos información personal de los usuarios,
                ni recopilamos datos sensibles en nuestros servidores.
            </p>

            <p>
                <strong>Información que NO recolectamos:</strong> No accedemos a tus datos
                personales ni guardamos credenciales. Tampoco registramos o compartimos
                tus mensajes con terceros.
            </p>

            <p>
                <strong>Uso de la información:</strong> El único propósito de la app es
                automatizar respuestas a comentarios que hagas o recibas, sin conservar
                historial alguno. No se procesan datos con fines comerciales.
            </p>

            <p>
                <strong>Integración con Facebook:</strong> Esta app está conectada a tu
                cuenta de Facebook exclusivamente para poder responder a tus comentarios.
                No accedemos a tu lista de amigos, mensajes privados u otra información
                personal que no sea estrictamente necesaria para la función de
                respuesta automática.
            </p>

            <p>
                <strong>Contacto:</strong> Si tienes alguna duda sobre nuestra política
                de privacidad, puedes escribirnos a{" "}
                <a
                    href="mailto:soporte@example.com"
                    className="underline text-blue-300 hover:text-blue-400"
                >
                    elcaminodelprogramadorweb@gmail.com
                </a>
                .
            </p>

            <p>
                Al utilizar esta aplicación, confirmas que has leído y aceptado los
                términos descritos en esta Política de Privacidad.
            </p>
        </main>
    );
}
