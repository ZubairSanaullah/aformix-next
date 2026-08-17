import Link from "next/link";
import { FileQuestion } from "lucide-react";

import WorkspaceButton from "@/components/workspace/ui/WorkspaceButton";

export default function EditPortfolioProjectNotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--workspace-primary-soft)] text-[var(--workspace-primary)]">
                <FileQuestion className="h-6 w-6" />
            </div>

            <div>
                <p className="text-sm font-semibold text-[var(--workspace-text)]">
                    Project not found
                </p>
                <p className="mt-1 text-sm text-[var(--workspace-text-muted)]">
                    This portfolio project doesn&apos;t exist or has been
                    permanently deleted.
                </p>
            </div>

            <Link href="/workspace/portfolio">
                <WorkspaceButton variant="secondary" size="md">
                    Back to Portfolio
                </WorkspaceButton>
            </Link>
        </div>
    );
}
