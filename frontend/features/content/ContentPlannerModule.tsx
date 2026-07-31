import { useState } from "react";
import { Calendar } from "lucide-react";

const sample = [
  { id: "c1", channel: "Instagram", title: "Orbit teaser", date: "2026-07-12" },
  { id: "c2", channel: "LinkedIn", title: "Launch notes", date: "2026-07-15" },
];

const ContentPlannerModule: React.FC = () => {
  const [items] = useState(sample);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Content Planner</p>
            <p className="text-sm text-slate-500">Plan posts, drafts and performance.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">New post</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#2894C7]/10 p-2 text-[#2894C7]"><Calendar size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{it.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{it.channel} · {it.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentPlannerModule;
