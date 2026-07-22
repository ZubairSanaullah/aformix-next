'use client';

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Divider from "./Divider";
import { convertAndFormatPriceString, CURRENCIES } from "../utils/currency";
import { useCurrency } from "../context/CurrencyContext";
import { pricingCategories, pricingData } from "../constants/pricingData";
import { Check } from "lucide-react";

const Pricing: React.FC = () => {
  const { currency, setCurrency, rates } = useCurrency();
  const [activeTab, setActiveTab] = useState(pricingCategories[0].id);

  const activeCategory = pricingCategories.find((c) => c.id === activeTab);
  const activePackages = activeCategory ? activeCategory.packages.map((pkgId) => pricingData[pkgId]).filter(Boolean) : [];

  return (
    <section id="pricing" className="reveal section-padding relative overflow-hidden w-full" aria-labelledby="pricing-heading">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl opacity-70 -z-10" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 -z-10" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-8 lg:px-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">Pricing Plans</span>
          <h2 className="heading-2 mb-6" id="pricing-heading">Transparent packages for every service</h2>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            Choose the right plan for your business and get the exact support you need to build, launch, and scale with confidence.
          </p>
          
          {/* Currency Selector — explicit bg for dark theme */}
          <div className="mt-6 inline-flex items-center gap-3 border border-[var(--color-border)] rounded-full px-5 py-2.5 shadow-sm" style={{ backgroundColor: 'var(--color-bg)' }}>
            <label htmlFor="pricing-currency" className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
              Currency:
            </label>
            <select
              id="pricing-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-primary/50 rounded-md px-2 py-1 border border-[var(--color-border)]"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            >
              {CURRENCIES.map((c) => (
                <option
                  key={c}
                  value={c}
                  style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 border border-[var(--color-border)] p-2 rounded-2xl" role="tablist" aria-label="Pricing categories" style={{ backgroundColor: 'var(--color-bg)' }}>
            {pricingCategories.map((category) => (
              <button
                id={`tab-${category.id}`}
                role="tab"
                tabIndex={activeTab === category.id ? 0 : -1}
                aria-selected={activeTab === category.id}
                aria-controls={`tabpanel-${category.id}`}
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`relative px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                  activeTab === category.id
                    ? "text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {activeTab === category.id && (
                  <motion.div
                    layoutId="pricingTabBubble"
                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
          >
            {activePackages.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 md:p-7 transition-shadow duration-300 ${
                  plan.popularBadge
                    ? "border-primary shadow-[0_20px_60px_rgba(39,184,144,0.15)] ring-1 ring-primary/30"
                    : "border-[var(--color-border)] hover:shadow-lg"
                }`}
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                {/* Most Popular Badge */}
                {plan.popularBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {/* Title Tag */}
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary text-xs font-bold uppercase tracking-widest self-start mb-5 mt-2">
                  {plan.title}
                </span>
                
                {/* Price */}
                <p className="text-4xl font-black tracking-tight text-[var(--color-text)] leading-none">
                  {convertAndFormatPriceString(plan.startingPrice, currency, rates)}
                </p>

                {/* Description */}
                <p className="mt-3 mb-5 text-[var(--color-text-muted)] text-sm leading-relaxed">
                  {plan.shortDescription}
                </p>

                {/* Divider */}
                <div className="border-t border-[var(--color-border)] mb-5" />

                {/* Features */}
                <ul className="flex-grow space-y-3 mb-7">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" aria-hidden="true"/>
                      <span className="text-sm text-[var(--color-text)] leading-snug">{feature.title}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-xs text-[var(--color-text-muted)] italic pl-7">
                      + {plan.features.length - 5} more features included
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <Link
                  href={`/pricing/${plan.id}`}
                  className={`w-full text-center block py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popularBadge
                      ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/30"
                      : "border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary hover:text-primary"
                  }`}
                >
                  View Details
                </Link>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <Divider />
    </section>
  );
};

export default Pricing;
