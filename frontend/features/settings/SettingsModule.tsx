"use client";

import { useEffect, useState } from "react";

import ProfileSettings from "./ProfileSettings";
import AppearanceSettings from "./AppearanceSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import SettingsSidebar, { SECTIONS, type SettingsSection } from "./SettingsSidebar";

function sectionFromHash(): SettingsSection {
    if (typeof window === "undefined") return "profile";

    const hash = window.location.hash.replace("#", "");
    const match = SECTIONS.find((section) => section.id === hash);

    return match ? match.id : "profile";
}

export default function SettingsModule() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

    // Sync from URL hash on mount + back/forward navigation.
    useEffect(() => {
        setActiveSection(sectionFromHash());

        const handleHashChange = () => setActiveSection(sectionFromHash());

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    function handleSectionChange(section: SettingsSection) {
        setActiveSection(section);

        if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `#${section}`);
        }
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your Aformix workspace and account preferences.
                </p>
            </div>

            <div className="space-y-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6 lg:space-y-0">
                <SettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                />

                <div>
                    {/* Only the active section is mounted, so Notifications/Appearance
                        data loads on demand rather than all on initial page load (13.25). */}
                    {activeSection === "profile" && <ProfileSettings />}
                    {activeSection === "appearance" && <AppearanceSettings />}
                    {activeSection === "notifications" && <NotificationSettings />}
                    {activeSection === "security" && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
}