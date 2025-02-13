// components/SocialLinks.tsx
"use client";

import { FaInstagram, FaYoutube, FaTiktok, FaGithub, FaXTwitter } from "react-icons/fa6";
import { FC } from "react";

const SocialLinks: FC = () => {
    return (
        <div className="flex justify-center gap-4 mt-8">
            {/* Instagram */}
            <a
                href="https://www.instagram.com/art0xdev"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaInstagram size={28} />
            </a>

            {/* Twitter (actualmente X) */}
            <a
                href="https://x.com/Art0xDev?mx=2"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaXTwitter size={28} />
            </a>

            {/* YouTube */}
            <a
                href="https://www.youtube.com/channel/UCcNKoN1XtrOH5WB5lBN8jaQ"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaYoutube size={28} />
            </a>
            {/* tiktok */}
            <a
                href="https://www.tiktok.com/@art0xdev"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaTiktok size={28} />
            </a>
            {/* tiktok */}
            <a
                href="https://github.com/arturogj92"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaGithub size={28} />
            </a>
        </div>
    );
};

export default SocialLinks;
