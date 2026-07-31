"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import Header from "@/components/workspace/Header";
import Sidebar from "@/components/workspace/Sidebar";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

const SIDEBAR_STORAGE_KEY = "aformix:sidebar-collapsed";

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  /**
   * Mobile drawer state.
   */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Desktop collapsed state.
   */
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  /**
   * Restore sidebar preference.
   */
  useEffect(() => {
    const savedState = localStorage.getItem(
      SIDEBAR_STORAGE_KEY
    );

    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  /**
   * Persist sidebar preference.
   */
  useEffect(() => {
    localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  /**
   * Toggle desktop sidebar.
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((previous) => !previous);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore when typing in form fields
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
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
    <div className="flex min-h-screen bg-[var(--color-background)]">
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
        />

        <main className="flex-1 overflow-x-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  );
}