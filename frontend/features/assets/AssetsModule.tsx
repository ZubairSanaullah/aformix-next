import React from "react";
import { ImageIcon, Layers, Archive } from "lucide-react";

const assets = [
  { id: "brand-kit", label: "Brand kit", type: "Design", status: "Updated" },
  { id: "video-library", label: "Video library", type: "Media", status: "Pending review" },
  { id: "copy-templates", label: "Copy templates", type: "Content", status: "Ready" },
];

const AssetsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Assets</p>
            <p className="text-sm text-slate-500">Manage visual, brand, and content assets for Aformix.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
            <ImageIcon size={16} /> Upload asset
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[#2894C7]">
              <Layers size={16} />
              <p className="text-sm font-semibold">Asset library</p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{assets.length}</p>
            <p className="mt-2 text-sm text-slate-500">Core assets organized.</p>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Archive size={16} />
              <p className="text-sm font-semibold">Recent updates</p>
            </div>
            <div className="mt-4 space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{asset.label}</p>
                      <p className="text-xs text-slate-500">{asset.type}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">{asset.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetsModule;
