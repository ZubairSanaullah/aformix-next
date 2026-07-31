import React from "react";
import { Search, BarChart2, Zap } from "lucide-react";

const sampleKeywords = [
  { term: "aformix", volume: 1200, difficulty: "Low" },
  { term: "orbit onboarding", volume: 320, difficulty: "Medium" },
  { term: "productized services", volume: 210, difficulty: "High" },
];

const SEOWorkspaceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">SEO Workspace</p>
            <p className="text-sm text-slate-500">Audit, track keywords, and monitor opportunities.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
              <Search size={16} /> Run quick audit
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium">
              <Zap size={16} /> Suggestions
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="col-span-2 rounded-[20px] border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Top keyword opportunities</p>
            <div className="mt-4 space-y-3">
              {sampleKeywords.map((k) => (
                <div key={k.term} className="flex items-center justify-between rounded-lg bg-white p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{k.term}</p>
                    <p className="text-xs text-slate-500">Volume {k.volume.toLocaleString()}</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">{k.difficulty}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-[#2894C7]">
              <BarChart2 size={16} />
              <p className="text-sm font-semibold">Health</p>
            </div>
            <p className="mt-4 text-3xl font-semibold">Good</p>
            <p className="mt-2 text-sm text-slate-500">Crawlability is fine; content freshness could improve.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEOWorkspaceModule;
