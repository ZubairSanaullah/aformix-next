"use client";

interface EditorFooterProps {
    html: string;
}

function stripHtml(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function EditorFooter({
    html,
}: EditorFooterProps) {
    const text = stripHtml(html);

    const words = text.length
        ? text.split(/\s+/).length
        : 0;

    const characters = text.length;

    const readingTime = Math.max(
        1,
        Math.ceil(words / 200)
    );

    return (
        <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-5">
                <span>
                    <strong>{words}</strong> words
                </span>

                <span>
                    <strong>{characters}</strong> characters
                </span>

                <span>
                    <strong>{readingTime}</strong> min read
                </span>
            </div>

            <span>HTML</span>
        </div>
    );
}