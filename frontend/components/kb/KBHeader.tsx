import Link from "next/link";
import { BookOpen } from "lucide-react";

import KBSearchBar from "./KBSearchBar";

export default function KBHeader() {
    return (
        <header className="border-b border-[var(--color-border)]">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/kb"
                    className="flex items-center gap-2 text-lg font-extrabold text-[var(--color-text)]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                        <BookOpen className="h-4 w-4" />
                    </span>
                    <span>
                        Aformix <span className="gradient-text">Docs</span>
                    </span>
                </Link>

                <div className="sm:w-72">
                    <KBSearchBar compact />
                </div>
            </div>
        </header>
    );
}
