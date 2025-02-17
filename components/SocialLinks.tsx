"use client";

import { FC, useEffect, useState } from "react";
import {
    FaInstagram,
    FaYoutube,
    FaTiktok,
    FaGithub,
    FaXTwitter,
    FaLinkedin,
} from "react-icons/fa6";
import { SocialLinkData } from "@/app/admin/types";

// Mapeo name => icon
function getSocialIcon(name: string) {
    switch (name) {
        case "instagram":
            return <FaInstagram size={28} />;
        case "twitter":
            return <FaXTwitter size={28} />;
        case "youtube":
            return <FaYoutube size={28} />;
        case "tiktok":
            return <FaTiktok size={28} />;
        case "github":
            return <FaGithub size={28} />;
        case "linkedin":
            return <FaLinkedin size={28} />;
        default:
            return null;
    }
}

/**
 * Muestra las redes sociales que están `visible`, ordenadas por `position`.
 */
const SocialLinks: FC = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

    useEffect(() => {
        fetch("/api/social-links")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSocialLinks(data);
                }
            })
            .catch((err) => console.error("Error fetching social links:", err));
    }, []);

    const visibleLinks = socialLinks
        .filter((s) => s.visible)
        .sort((a, b) => a.position - b.position);

    return (
        <div className="flex justify-center gap-4 mt-8">
            {visibleLinks.map((link) => {
                const Icon = getSocialIcon(link.name);
                if (!Icon) return null;
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {Icon}
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinks;
