"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
    text: string;         // El texto completo que quieres mostrar
    speed?: number;       // Velocidad de escritura (ms) entre caracteres
    showCursor?: boolean; // Mostrar o no el cursor parpadeante
    cursorChar?: string;  // Carácter que hace de cursor
}

export default function Typewriter({
                                       text,
                                       speed = 50,
                                       showCursor = true,
                                       cursorChar = "|",
                                   }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [cursorVisible, setCursorVisible] = useState(true);

    // Efecto para ir "escribiendo" el texto
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i === text.length) {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    // Efecto para parpadear el cursor (si está habilitado)
    useEffect(() => {
        if (!showCursor) return;
        const cursorInterval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, [showCursor]);

    return (
        <span>
      {displayedText}
            {showCursor && cursorVisible && <span>{cursorChar}</span>}
    </span>
    );
}
