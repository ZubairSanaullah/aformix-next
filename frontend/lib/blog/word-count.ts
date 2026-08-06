export function calculateWordCount(
    html: string
) {
    const text = html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!text) return 0;

    return text.split(" ").length;
}