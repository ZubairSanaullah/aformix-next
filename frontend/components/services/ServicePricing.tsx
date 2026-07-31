'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { ServicePricingPlan } from "@/types/service";
import Divider from "@/components/Divider";
import {
  convertAndFormatPriceString,
  getSelectedCurrency,
  setSelectedCurrency,
  CURRENCIES,
} from "@/utils/currency";

interface ServicePricingProps {
  pricingPlans?: ServicePricingPlan[];
}

const ServicePricing: React.FC<ServicePricingProps> = ({ pricingPlans }) => {
  const [currency, setCurrencyState] = useState<string>(getSelectedCurrency());

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  if (!pricingPlans || pricingPlans.length === 0) return null;

  return (
    <section id="pricing" className="reveal section-padding relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl opacity-70 -z-10"></div>
      <div className="max-w-7xl mx-auto relative z-10 px-6 md:px-12 lg:px-24">
        <div className="mb-12 text-center">
          <span className="section-badge inline-block mb-4">Pricing Packages</span>
          <h2 className="heading-2 mb-4">Flexible solutions for <br /> <span className="gradient-text">every scale</span></h2>
          <p className="max-w-2xl mx-auto text-[var(--color-text-muted)] text-lg">
            Choose the right plan to get the features and support you need.
          </p>
          <div className="mt-8 inline-flex items-center">
            <label className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mr-3">Currency:</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrencyState(e.target.value)}
                className="appearance-none bg-bg border border-[var(--color-border)] px-4 py-2 pr-8 rounded-lg text-[var(--color-text)] focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-text-muted)]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.title}
              className={`card-premium p-8 border border-glass-border flex flex-col h-full ${plan.featured ? "scale-[1.02] border-primary/50 shadow-[0_30px_80px_rgba(49,185,143,0.12)] relative" : ""}`}
            >
              {plan.featured && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg z-10">
                   Most Popular
                 </div>
              )}
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-semibold uppercase tracking-[0.2em] w-fit mb-8">
                {plan.title}
              </span>
              <div>
                <p className="text-5xl font-black tracking-tight text-[var(--color-text)]">{convertAndFormatPriceString(plan.price, currency)}</p>
                <p className="mt-4 text-[var(--color-text-muted)] leading-relaxed h-[3rem]">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--color-text)]">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.link || `/pricing/${plan.id}`} className={`btn-primary mt-auto w-full text-center block cursor-pointer ${plan.featured ? "" : "bg-transparent border border-primary text-primary hover:bg-primary/10"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Divider />
    </section>
  );
};

export default ServicePricing;
