import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes article HTML before it's rendered on a PUBLIC, unauthenticated
 * page. This is the trust-boundary change flagged in the 15.22 README:
 * article content is authored by admins, but once it's shown to anonymous
 * visitors it needs to go through a sanitizer rather than being trusted
 * as-is via dangerouslySetInnerHTML.
 *
 * Requires `isomorphic-dompurify` as a dependency — it isn't currently in
 * package.json, so run:
 *
 *   npm install isomorphic-dompurify
 *
 * The allowlist below matches the tags your TipTap extensions can actually
 * produce (StarterKit, Underline, Link, Image, Highlight, TaskList/Item,
 * TextAlign via style attr, CodeBlockLowlight). Extend it if you add more
 * TipTap extensions later.
 */
export function sanitizeArticleHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "s",
            "strike",
            "mark",
            "a",
            "img",
            "ul",
            "ol",
            "li",
            "blockquote",
            "pre",
            "code",
            "h1",
            "h2",
            "h3",
            "h4",
            "hr",
            "span",
            "div",
        ],
        ALLOWED_ATTR: [
            "href",
            "target",
            "rel",
            "src",
            "alt",
            "title",
            "class",
            "style",
            "type", // ordered list start type, task item checkbox state
            "checked",
            "data-type",
            "data-checked",
        ],
        ALLOWED_URI_REGEXP:
            /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
}
