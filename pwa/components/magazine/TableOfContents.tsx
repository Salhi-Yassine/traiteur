"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Heading {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
}

/** Parses an HTML string and extracts h2/h3 headings as anchor items. */
function extractHeadings(html: string): Heading[] {
    if (typeof window === "undefined") return [];
    const container = document.createElement("div");
    container.innerHTML = html;
    const nodes = container.querySelectorAll("h2, h3");
    const headings: Heading[] = [];
    nodes.forEach((node, i) => {
        const level = node.tagName === "H2" ? 2 : 3;
        const text = node.textContent?.trim() ?? "";
        const id = `toc-heading-${i}`;
        node.id = id;
        headings.push({ id, text, level });
    });
    return headings;
}

export default function TableOfContents({ content, className }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Parse headings from article content after mount
    useEffect(() => {
        const extracted = extractHeadings(content);
        setHeadings(extracted);
    }, [content]);

    // Inject IDs into the rendered article DOM and observe
    useEffect(() => {
        if (headings.length === 0) return;

        // Inject IDs into the actual rendered DOM headings
        headings.forEach(({ id, text }) => {
            const allHeadings = Array.from(document.querySelectorAll("h2, h3"));
            const target = allHeadings.find((el) => el.textContent?.trim() === text);
            if (target && !target.id) target.id = id;
            if (target && target.id !== id) target.id = id; // overwrite to be safe
        });

        // Set up IntersectionObserver
        const ids = headings.map((h) => h.id);
        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={cn("space-y-1", className)}
            aria-label="Table des matières"
        >
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                Dans cet article
            </p>
            {headings.map((heading) => (
                <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }}
                    className={cn(
                        "block text-[13px] leading-snug transition-all duration-200 py-1.5 border-l-2",
                        heading.level === 2 ? "pl-4" : "pl-7 text-[12px]",
                        activeId === heading.id
                            ? "border-primary text-primary font-semibold"
                            : "border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-200"
                    )}
                >
                    {heading.text}
                </a>
            ))}
        </motion.nav>
    );
}
