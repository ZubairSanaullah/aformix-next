/**
 * Converts a display name into a URL-safe slug matching the backend's
 * slug validation rule: lowercase letters, numbers, single hyphens.
 * (See `slugSchema` in lib/validations/knowledge-base.ts.)
 */
export function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // strip accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}
