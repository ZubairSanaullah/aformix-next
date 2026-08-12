import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import WorkspaceLayoutClient from "./WorkspaceLayoutClient";

interface WorkspaceLayoutProps {
    children: ReactNode;
}

export default async function WorkspaceLayout({
    children,
}: WorkspaceLayoutProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <WorkspaceLayoutClient user={session.user}>
            {children}
        </WorkspaceLayoutClient>
    );
}