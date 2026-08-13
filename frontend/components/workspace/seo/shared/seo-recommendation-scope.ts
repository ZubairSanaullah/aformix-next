// Fields covered by SEOPageForm (title, description, canonical, robots, OG).
// The analyzer also scores content/heading/image/link checks, but SEOPage
// records don't store page content — those categories will always read as
// "missing" here regardless of what's configured, so they're treated as
// read-only context rather than actionable items tied to editable fields.
const EDITABLE_KEY_PREFIXES = [
    "title-",
    "description-",
    "canonical-",
    "index-",
    "noindex-",
    "follow-",
    "nofollow-",
    "og-",
];

export function isEditableRecommendation(key: string): boolean {
    return EDITABLE_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}
