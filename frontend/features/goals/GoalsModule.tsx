import React from "react";
import { Target, CheckCircle } from "lucide-react";

const goals = [
  { id: "g1", title: "Launch internal workspace", progress: 78 },
  { id: "g2", title: "Complete onboarding funnel", progress: 42 },
  { id: "g3", title: "Ship SEO playbook", progress: 55 },
];

const GoalsModule: React.FC = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Goals</p>
          <p className="text-sm text-slate-500">Track progress toward your highest priorities.</p>
        </div>
        <div className="rounded-full bg-[#2894C7]/10 p-2 text-[#2894C7]">
          <Target size={18} />
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                <p className="text-xs text-slate-500">{goal.progress}% complete</p>
              </div>
              <div className="rounded-full bg-white p-2 text-[#2894C7] shadow-sm">
                <CheckCircle size={18} />
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-[#2894C7]" style={{ width: `${goal.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default GoalsModule;
