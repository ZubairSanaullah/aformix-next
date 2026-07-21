'use client';

import React, { useRef, useState } from "react";
import { Send, MapPin, Mail, Phone, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const SERVICES = [
  "Web Development",
  "E-Commerce Website",
  "Custom Software",
  "Mobile App Development",
  "UI/UX Design",
  "Maintenance & Support",
  "Other",
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "Pakistan",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@aformix.com",
    href: "mailto:hello@aformix.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+92 301 9170936",
    href: "tel:+923019170936",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
  },
];

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ─── GSAP Animations ────────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".contact-badge",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )
        .fromTo(
          ".contact-heading",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".contact-sub",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".contact-info-card",
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".contact-form-panel",
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.6"
        );
    },
    { scope: sectionRef }
  );

  // ─── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formState.name.trim()) newErrors.name = "Full name is required.";
    if (!formState.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formState.message.trim()) {
      newErrors.message = "Please tell us about your project.";
    } else if (formState.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const data = new FormData();
    data.append("access_key", process.env.NEXT_PUBLIC_ACCESS_KEY ?? "");
    data.append("from_name", "Aformix Contact Form");
    data.append("subject", `New Lead — ${formState.name}`);
    data.append("name", formState.name);
    data.append("email", formState.email);
    data.append("phone", formState.phone);
    data.append("service", formState.service || "Not specified");
    data.append("message", formState.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        setFormState({ name: "", email: "", phone: "", service: "", message: "" });
        await Swal.fire({
          title: "Message Sent!",
          text: "Thank you for reaching out. We'll get back to you within 24 hours.",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#27b990",
          background: "var(--color-surface)",
          color: "var(--color-text)",
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: json.message || "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#27b990",
          background: "var(--color-surface)",
          color: "var(--color-text)",
        });
      }
    } catch {
      Swal.fire({
        title: "Network Error",
        text: "Please check your connection and try again.",
        icon: "error",
        confirmButtonColor: "#27b990",
        background: "var(--color-surface)",
        color: "var(--color-text)",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="reveal section-padding relative overflow-hidden w-full"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="contact-badge text-primary font-black tracking-[0.35em] uppercase mb-4 inline-block">
            Get in Touch
          </span>
          <h2 className="contact-heading heading-2 mb-6">
            Let's Build Something Great
          </h2>
          <p className="contact-sub text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
            Have a project in mind? Tell us about it and we'll craft a solution
            tailored to your goals.
          </p>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* ─── Left: Contact Info ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {CONTACT_INFO.map((item, i) => (
              <div
                key={i}
                className="contact-info-card glass-effect rounded-3xl border border-[var(--color-glass-border)] p-6 flex items-center gap-5 group hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                  <item.icon size={22} />
                </div>
                <div>
                  <p className="text-[var(--color-text-muted)] text-xs font-black uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[var(--color-text)] font-semibold text-base hover:text-primary transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[var(--color-text)] font-semibold text-base">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Trust badge */}
            <div className="contact-info-card glass-effect rounded-3xl border border-[var(--color-glass-border)] p-6 mt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {["#27b990", "#684b9e", "#f43f5e"].map((c, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-[var(--color-surface)] flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: c }}
                    >
                      {["J", "S", "M"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-[var(--color-text-muted)] text-xs">
                    Trusted by 45+ clients
                  </p>
                </div>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                "Aformix delivered our platform on time and exceeded all our
                expectations. Highly recommend!"
              </p>
            </div>
          </div>

          {/* ─── Right: Form ────────────────────────────────────────────── */}
          <div className="contact-form-panel lg:col-span-3">
            <div className="glass-effect rounded-[2.5rem] border border-[var(--color-glass-border)] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />

              <h3 className="text-2xl font-black text-[var(--color-text)] mb-8">
                Send us a message
              </h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2"
                    >
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input-field w-full ${errors.name ? "!border-red-500 !shadow-[0_0_0_2px_rgba(239,68,68,0.15)]" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2"
                    >
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`input-field w-full ${errors.email ? "!border-red-500 !shadow-[0_0_0_2px_rgba(239,68,68,0.15)]" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone + Service */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-service"
                      className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2"
                    >
                      Service Needed
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      className="input-field w-full appearance-none cursor-pointer"
                    >
                      <option value="">Select a service…</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2"
                  >
                    Your Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, goals, and timeline…"
                    rows={5}
                    className={`input-field w-full resize-none ${errors.message ? "!border-red-500 !shadow-[0_0_0_2px_rgba(239,68,68,0.15)]" : ""}`}
                  />
                  {errors.message ? (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">
                      {errors.message}
                    </p>
                  ) : (
                    <p className="text-[var(--color-text-muted)] text-xs mt-1.5">
                      Minimum 20 characters
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base group disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[var(--color-text-muted)] text-xs">
                  We respect your privacy. Your information is never shared.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
