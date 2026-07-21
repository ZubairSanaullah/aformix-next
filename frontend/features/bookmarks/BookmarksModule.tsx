import React from "react";
import { Bookmark, Layers, Heart } from "lucide-react";

const bookmarks = [
  { id: "bookmark-1", title: "Orbit workspace launch checklist", category: "Ops", saved: "Today" },
  { id: "bookmark-2", title: "Aformix brand toolkit", category: "Design", saved: "Yesterday" },
  { id: "bookmark-3", title: "SEO audit template", category: "Growth", saved: "2 days ago" },
];

const BookmarksModule: React.FC = () => (
  <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Bookmarks</p>
          <p className="text-sm text-slate-500">Quick access to saved docs, templates, and ideas.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
          <Bookmark size={16} /> Add bookmark
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-[#2894C7]">
            <Heart size={16} />
            <p className="text-sm font-semibold">Saved items</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{bookmarks.length}</p>
          <p className="mt-2 text-sm text-slate-500">Bookmarks available to reopen instantly.</p>
        </div>

        <div className="rounded-[20px] border border-slate-100 bg-white p-4 md:col-span-2">
          <div className="flex items-center gap-2 text-slate-900">
            <Layers size={16} />
            <p className="text-sm font-semibold">Recent bookmarks</p>
          </div>
          <div className="mt-4 space-y-3">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{bookmark.title}</p>
                    <p className="text-xs text-slate-500">{bookmark.category}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{bookmark.saved}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default BookmarksModule;
