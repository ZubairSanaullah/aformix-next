"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function LogoutButton() {
    async function handleLogout() {
        await signOut({
            callbackUrl: "/login",
        });

        toast.success("Logged out successfully.");
    }

    return (
        <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-background)] px-3 py-1.5 text-xs font-medium text-[var(--workspace-text-muted)] transition-colors hover:border-[var(--workspace-danger)] hover:text-[var(--workspace-danger)]"
        >
            Logout
        </button>
    );
}