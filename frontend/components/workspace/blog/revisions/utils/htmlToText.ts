export function htmlToText(html: string): string {
    if (!html) {
        return "";
    }

    // Browser environment
    if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        return (doc.body.textContent ?? "").trim();
    }

    // Fallback for non-browser environments
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}