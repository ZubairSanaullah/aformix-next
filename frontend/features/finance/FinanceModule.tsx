import React from "react";
import { Wallet, DollarSign, PieChart } from "lucide-react";

const sampleInvoices = [
  { id: "inv-001", client: "Northstar Studio", amount: 4200, status: "Sent" },
  { id: "inv-002", client: "Orbit Labs", amount: 1200, status: "Paid" },
  { id: "inv-003", client: "A/B Agency", amount: 980, status: "Due" },
];

const FinanceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Finance</p>
            <p className="text-sm text-slate-500">Invoices, cashflow, and quick financial overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-full bg-[#2894C7] px-4 py-2 text-sm font-semibold text-white">
              <DollarSign size={16} /> New invoice
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium">
              <Wallet size={16} /> Export
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="col-span-2 rounded-[20px] border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Recent invoices</p>
            <div className="mt-4 space-y-2">
              {sampleInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{inv.client}</p>
                    <p className="text-xs text-slate-500">Invoice {inv.id}</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">${inv.amount.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{inv.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-[#2894C7]">
              <PieChart size={16} />
              <p className="text-sm font-semibold">Summary</p>
            </div>
            <p className="mt-4 text-3xl font-semibold">$14,380</p>
            <p className="mt-2 text-sm text-slate-500">Available balance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceModule;
