import React from "react";
import { Book, Layers, Search } from "lucide-react";

const resources = [
  { id: "knowledge-guides", title: "Knowledge guides", description: "Strategy, process, and product briefs." },
  { id: "brand-standards", title: "Brand standards", description: "Design tokens, colors, and voice." },
  { id: "playbooks", title: "Playbooks", description: "Launch, growth, and ops workflows." },
];

const KnowledgeBaseModule: React.FC = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Knowledge Base</p>
          <p className="text-sm text-slate-500">Central knowledge, playbooks, and internal guidance.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
          <Search size={16} /> Search knowledge
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-[#2894C7]">
            <Book size={16} />
            <p className="text-sm font-semibold">Knowledge assets</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{resources.length}</p>
          <p className="mt-2 text-sm text-slate-500">Core guides ready for reference.</p>
        </div>

        <div className="rounded-[20px] border border-slate-100 bg-white p-4 md:col-span-2">
          <div className="flex items-center gap-2 text-slate-900">
            <Layers size={16} />
            <p className="text-sm font-semibold">Top resources</p>
          </div>
          <div className="mt-4 space-y-3">
            {resources.map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{resource.title}</p>
                <p className="mt-1 text-sm text-slate-500">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default KnowledgeBaseModule;
