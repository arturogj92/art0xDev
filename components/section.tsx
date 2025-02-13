"use client";
import { FC, ReactNode } from "react";

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section: FC<SectionProps> = ({ title, children }) => {
    return (
        <section className="my-8 flex flex-col items-center">
            <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
            {/*
        Contenedor que coloca todos los enlaces en columna
        y los centra horizontalmente
      */}
            <div className="w-full flex flex-col items-center">
                {children}
            </div>
        </section>
    );
};

export default Section;
