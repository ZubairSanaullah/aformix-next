import { useState } from "react";
import { Plus, FileText } from "lucide-react";

const initialNotes = [
  { id: "n1", title: "Workspace vision", excerpt: "Design the premium OS for Aformix" },
  { id: "n2", title: "SEO checklist", excerpt: "Meta, headings, images, links" },
];

const NotesModule: React.FC = () => {
  const [notes] = useState(initialNotes);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Notes</p>
            <p className="text-sm text-slate-500">Capture ideas, docs, and snippets.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
            <Plus size={14} />
            New note
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#2894C7]/10 p-2 text-[#2894C7]">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{note.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotesModule;
