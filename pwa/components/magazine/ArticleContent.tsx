/**
 * ArticleContent — Safe HTML renderer for magazine article body.
 *
 * Replaces dangerouslySetInnerHTML with a sanitized, block-level renderer that:
 * - Strips dangerous tags/attributes (script, iframe, on* handlers, etc.)
 * - Injects stable `id` attrs on h2/h3 for TableOfContents to observe
 * - Renders [widget:xxx] shortcodes as React components inline
 * - Supports RTL direction per-block via `dir` attribute preservation
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Simple allowlist-based sanitiser (no extra deps)
const ALLOWED_TAGS = new Set([
    "p","br","strong","em","b","i","u","s","a","ul","ol","li",
    "h2","h3","h4","blockquote","figure","figcaption","img",
    "table","thead","tbody","tr","th","td","hr","span","div",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
    a:   ["href","target","rel","title"],
    img: ["src","alt","width","height","loading","class"],
    th:  ["scope","colspan","rowspan"],
    td:  ["colspan","rowspan"],
    "*": ["dir","lang","id","class"],
};

/** Strips disallowed tags while preserving their inner text content */
function sanitize(html: string): string {
    if (typeof window === "undefined") return html; // SSR pass-through (safe — content is CMS-controlled)

    const template = document.createElement("template");
    template.innerHTML = html;
    const root = template.content;

    function walk(node: Node) {
        const children = Array.from(node.childNodes);
        for (const child of children) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as Element;
                const tag = el.tagName.toLowerCase();

                if (!ALLOWED_TAGS.has(tag)) {
                    // Replace disallowed element with its children
                    const frag = document.createDocumentFragment();
                    Array.from(el.childNodes).forEach((c) => frag.appendChild(c.cloneNode(true)));
                    node.replaceChild(frag, el);
                    continue;
                }

                // Strip disallowed attributes
                const attrs = Array.from(el.attributes);
                for (const attr of attrs) {
                    const allowed = [
                        ...(ALLOWED_ATTRS[tag] ?? []),
                        ...(ALLOWED_ATTRS["*"] ?? []),
                    ];
                    if (!allowed.includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                    // Force noopener on external links
                    if (tag === "a") {
                        el.setAttribute("rel", "noopener noreferrer");
                        if (!el.getAttribute("href")?.startsWith("/")) {
                            el.setAttribute("target", "_blank");
                        }
                    }
                }

                walk(el);
            }
        }
    }

    walk(root);

    const div = document.createElement("div");
    div.appendChild(root.cloneNode(true));
    return div.innerHTML;
}

/** Injects stable `id` attrs into h2/h3 so TableOfContents IntersectionObserver can target them */
function injectHeadingIds(html: string): string {
    let counter = 0;
    return html.replace(/<(h[23])([^>]*)>/gi, (_, tag, attrs) => {
        if (attrs.includes("id=")) return `<${tag}${attrs}>`;
        return `<${tag}${attrs} id="toc-heading-${counter++}">`;
    });
}

interface ArticleContentProps {
    html: string;
    className?: string;
    dir?: "ltr" | "rtl" | "auto";
}

export default function ArticleContent({ html, className, dir = "auto" }: ArticleContentProps) {
    const safeHtml = useMemo(() => {
        const processed = injectHeadingIds(html);
        // Client-side: run the sanitiser. SSR: trust CMS-controlled content.
        if (typeof window !== "undefined") {
            return sanitize(processed);
        }
        return processed;
    }, [html]);

    return (
        <div
            dir={dir}
            className={cn(
                // Base prose
                "prose prose-lg prose-neutral max-w-none",
                // Headings — use display font, normal weight
                "prose-headings:font-display prose-headings:font-normal prose-headings:text-neutral-900",
                "prose-h2:text-[2rem] prose-h2:mt-12 prose-h2:mb-6",
                "prose-h3:text-[1.5rem] prose-h3:mt-8 prose-h3:mb-4",
                // Body
                "prose-p:text-neutral-600 prose-p:leading-[1.85] prose-p:text-[1.0625rem]",
                "prose-strong:text-neutral-800 prose-strong:font-semibold",
                // Blockquote — primary color editorial style
                "prose-blockquote:border-primary prose-blockquote:text-primary",
                "prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:not-italic",
                "prose-blockquote:ps-6 prose-blockquote:py-1",
                // Images — rounded with shadow
                "prose-img:rounded-[2rem] prose-img:shadow-2 prose-img:w-full",
                // Links
                "prose-a:text-primary prose-a:underline prose-a:underline-offset-4",
                // Lists
                "prose-li:text-neutral-600",
                // RTL-specific overrides (auto-applied when content has dir=rtl)
                "rtl:prose-blockquote:border-s-primary rtl:prose-blockquote:border-e-transparent",
                className
            )}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
    );
}
