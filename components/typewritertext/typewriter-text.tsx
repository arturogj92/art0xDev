"use client";

import "./typewriter.css";

interface TypewriterTextProps {
    text: string;
}


export default function TypewriterText({text}: TypewriterTextProps) {
    return (
        <span className="typewriter">
      {text}
    </span>
    );
}
