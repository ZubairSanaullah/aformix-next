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
            className="rounded-md bg-black px-4 py-2 text-white"
        >
            Logout
        </button>
    );
}