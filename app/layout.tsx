import type {Metadata} from "next";
import {DM_Sans, Geist, Geist_Mono} from "next/font/google";
import {ThemeProvider} from "@/components/theme-provider"; // Asegúrate de importar correctamente
import "./globals.css";

// Carga la fuente, opcionalmente indicando subsets, weights, styles
const dmSans = DM_Sans({
    subsets: ['latin'],   // o ['latin', 'latin-ext'] etc.
    weight: ['400'], // pesos que uses
    variable: '--font-dm-sans',  // para usarla como variable CSS
    display: 'swap',      // recomendación de Google
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: process.env.NODE_ENV === "development" ? "[L] Art0xDev" : "Art0xDev",
    description: "Si quieres hacerte un experto en programación, este es tu sitio",
    icons: {
        icon: process.env.NODE_ENV === "development" ? "/favicon-local.ico" : "/favicon.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="es" suppressHydrationWarning
              className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} antialiased`}>
        <body

        >
        {/* Theme provider wraps the entire app */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
