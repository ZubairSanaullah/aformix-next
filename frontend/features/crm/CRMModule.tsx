import { useState } from "react";
import { Users } from "lucide-react";

const initialClients = [
  { id: "c1", name: "Northstar Studio", email: "hello@northstar.com", phone: "+1 555 123" },
  { id: "c2", name: "Maven Co.", email: "team@maven.co", phone: "+1 555 987" },
];

const CRMModule: React.FC = () => {
  const [clients] = useState(initialClients);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">CRM</p>
            <p className="text-sm text-slate-500">Clients, leads, and contact history.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">New client</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#2894C7]/10 p-2 text-[#2894C7]"><Users size={16} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{c.email} · {c.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CRMModule;
