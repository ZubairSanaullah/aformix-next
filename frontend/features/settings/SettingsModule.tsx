import React from "react";
import { Settings, ShieldCheck, Bell, User } from "lucide-react";

const SettingsModule: React.FC = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Settings</p>
          <p className="text-sm text-slate-500">Workspace preferences and access controls.</p>
        </div>
        <div className="rounded-full bg-[#2894C7]/10 p-2 text-[#2894C7]">
          <Settings size={18} />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { title: "Profile", icon: User, desc: "Manage workspace identity." },
          { title: "Notifications", icon: Bell, desc: "Control alerts and updates." },
          { title: "Security", icon: ShieldCheck, desc: "Permissions, sessions, and auth." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-[#2894C7]">
                <Icon size={18} />
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              </div>
              <p className="mt-3 text-sm text-slate-500">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  </div>
);

export default SettingsModule;
