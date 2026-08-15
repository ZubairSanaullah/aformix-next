import { BookOpen, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

/**
 * Category `icon` values are stored as kebab-case strings (see the
 * placeholder "book-open" in KnowledgeCategoryFormDialog from 15.19).
 * lucide-react exports components in PascalCase, so this converts and
 * looks the icon up, falling back to BookOpen if the name doesn't match
 * anything (e.g. it was mistyped, or the icon set changed versions).
 */
export function resolveCategoryIcon(
    iconName: string | null | undefined
): LucideIcon {
    if (!iconName) {
        return BookOpen;
    }

    const pascalCase = iconName
        .split("-")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");

    const icon = (Icons as unknown as Record<string, LucideIcon>)[
        pascalCase
    ];

    return icon ?? BookOpen;
}
