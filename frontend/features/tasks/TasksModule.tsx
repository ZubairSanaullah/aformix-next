import { useState } from "react";
import { CheckSquare, Plus } from "lucide-react";

const initialTasks = [
  { id: "t1", title: "Draft PR checklist", done: false },
  { id: "t2", title: "Fix navbar animation", done: true },
];

const TasksModule: React.FC = () => {
  const [tasks] = useState(initialTasks);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Tasks</p>
            <p className="text-sm text-slate-500">Your personal to-dos and checklists.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
            <Plus size={14} />
            New task
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="rounded-lg bg-white p-2 text-[#2894C7]">
                <CheckSquare size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500">{task.done ? "Done" : "Open"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TasksModule;
