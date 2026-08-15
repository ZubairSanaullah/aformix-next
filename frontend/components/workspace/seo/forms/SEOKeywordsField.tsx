"use client";

import { useState, type KeyboardEvent } from "react";
import { Controller, type Control, type FieldError } from "react-hook-form";
import { X } from "lucide-react";

import WorkspaceFormField from "@/components/workspace/ui/WorkspaceFormField";
import { SEO_LIMITS, type SEOPageInput } from "@/lib/validations/seo";

interface SEOKeywordsFieldProps {
    control: Control<SEOPageInput>;
    error?: FieldError;
}

export default function SEOKeywordsField({
    control,
    error,
}: SEOKeywordsFieldProps) {
    const [draft, setDraft] = useState("");

    return (
        <Controller
            control={control}
            name="keywords"
            render={({ field }) => {
                const keywords = field.value ?? [];

                function addKeyword(rawValue: string) {
                    const value = rawValue.trim();

                    if (!value) return;

                    if (keywords.includes(value)) {
                        setDraft("");
                        return;
                    }

                    if (keywords.length >= SEO_LIMITS.keywords.max) {
                        setDraft("");
                        return;
                    }

                    field.onChange([...keywords, value]);
                    setDraft("");
                }

                function removeKeyword(value: string) {
                    field.onChange(keywords.filter((keyword) => keyword !== value));
                }

                function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
                    if (event.key === "Enter" || event.key === ",") {
                        event.preventDefault();
                        addKeyword(draft);
                        return;
                    }

                    if (
                        event.key === "Backspace" &&
                        !draft &&
                        keywords.length > 0
                    ) {
                        removeKeyword(keywords[keywords.length - 1]);
                    }
                }

                return (
                    <WorkspaceFormField label="Keywords" error={error?.message}>
                        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-surface)] p-2">
                            {keywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="inline-flex items-center gap-1 rounded-full bg-[var(--workspace-primary-soft)] px-2 py-1 text-[11px] font-medium text-[var(--workspace-primary)]"
                                >
                                    {keyword}
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(keyword)}
                                        aria-label={`Remove ${keyword}`}
                                        className="rounded-full p-0.5 hover:bg-[var(--workspace-primary)]/20"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}

                            <input
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => addKeyword(draft)}
                                placeholder={
                                    keywords.length === 0
                                        ? "Type a keyword and press Enter..."
                                        : ""
                                }
                                className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-xs text-[var(--workspace-text)] outline-none placeholder:text-[var(--workspace-text-subtle)]"
                            />
                        </div>

                        <p className="mt-1 text-[11px] text-[var(--workspace-text-subtle)]">
                            {keywords.length} / {SEO_LIMITS.keywords.max} keywords
                        </p>
                    </WorkspaceFormField>
                );
            }}
        />
    );
}
