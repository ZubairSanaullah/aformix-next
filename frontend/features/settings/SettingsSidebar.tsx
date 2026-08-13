"use client";

import { Bell, Palette, ShieldCheck, User } from "lucide-react";

export type SettingsSection = "profile" | "appearance" | "notifications" | "security";

const SECTIONS: {
    id: SettingsSection;
    title: string;
    description: string;
    icon: typeof User;
}[] = [
    {
        id: "profile",
        title: "Profile",
        description: "Identity and account info",
        icon: User,
    },
    {
        id: "appearance",
        title: "Appearance",
        description: "Theme and preferences",
        icon: Palette,
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Alerts and updates",
        icon: Bell,
    },
    {
        id: "security",
        title: "Security",
        description: "Password and access",
        icon: ShieldCheck,
    },
];

interface SettingsSidebarProps {
    activeSection: SettingsSection;
    onSectionChange: (section: SettingsSection) => void;
}

export default function SettingsSidebar({
    activeSection,
    onSectionChange,
}: SettingsSidebarProps) {
    return (
        <>
            {/* Desktop / tablet vertical nav */}
            <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:block">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const active = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSectionChange(section.id)}
                            aria-current={active ? "page" : undefined}
                            className={`mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition last:mb-0 ${
                                active
                                    ? "bg-[#31B98F]/10 text-[#238567]"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                            <Icon size={18} className="mt-0.5 shrink-0" />
                            <span>
                                <span className="block text-sm font-medium">
                                    {section.title}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-400">
                                    {section.description}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </aside>

            {/* Mobile horizontal pill nav */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const active = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSectionChange(section.id)}
                            aria-current={active ? "page" : undefined}
                            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                                active
                                    ? "border-[#31B98F] bg-[#31B98F]/10 text-[#238567]"
                                    : "border-slate-200 bg-white text-slate-600"
                            }`}
                        >
                            <Icon size={16} />
                            {section.title}
                        </button>
                    );
                })}
            </div>
        </>
    );
}

export { SECTIONS };