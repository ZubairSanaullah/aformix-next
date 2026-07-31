import React from "react";
import { BarChart3, Activity, TrendingUp } from "lucide-react";

const AnalyticsModule: React.FC = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Analytics</p>
          <p className="text-sm text-slate-500">Performance metrics across workspace activity.</p>
        </div>
        <div className="rounded-full bg-[#2894C7]/10 p-2 text-[#2894C7]">
          <BarChart3 size={18} />
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Engagement", value: "82%", icon: Activity },
          { label: "Growth", value: "+14%", icon: TrendingUp },
          { label: "Velocity", value: "5.6/day", icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-[#2894C7]">
                <Icon size={16} />
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  </div>
);

export default AnalyticsModule;
