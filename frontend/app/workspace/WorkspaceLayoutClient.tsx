"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import Header from "@/components/workspace/Header";
import Sidebar from "@/components/workspace/Sidebar";

interface WorkspaceUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
}

interface WorkspaceLayoutClientProps {
    children: ReactNode;
    user: WorkspaceUser;
}

const SIDEBAR_STORAGE_KEY = "aformix:sidebar-collapsed";

export default function WorkspaceLayoutClient({
    children,
    user,
}: WorkspaceLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);

        if (savedState !== null) {
            setIsSidebarCollapsed(savedState === "true");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            SIDEBAR_STORAGE_KEY,
            String(isSidebarCollapsed),
        );
    }, [isSidebarCollapsed]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed((previous) => !previous);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;

            if (
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable
            ) {
                return;
            }

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "b"
            ) {
                event.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [toggleSidebar]);

    return (
        <div className="flex min-h-screen min-w-0 flex-1 bg-[var(--workspace-background)]">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onToggleSidebar={toggleSidebar}
                    user={user}
                />

                <main
                    id="main-content"
                    className="
                        relative
                        flex-1
                        overflow-x-hidden
                        bg-[var(--workspace-background)]
                        px-4
                        py-6
                        sm:px-6
                        lg:px-8
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            fixed
                            inset-x-0
                            top-0
                            z-0
                            h-64
                            bg-[radial-gradient(circle_at_50%_-20%,rgba(49,185,143,0.06),transparent_65%)]
                        "
                    />

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}