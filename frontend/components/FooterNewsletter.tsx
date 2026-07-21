'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed! Please check your email to verify.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-xl mx-auto lg:mx-0 mt-8 mb-12 lg:mt-0 lg:mb-0"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

      <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-[80px] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-2 tracking-tight">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-cyan-400">Insider Network</span>
          </h3>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-xl p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <FaCheckCircle className="text-[var(--color-primary)] text-4xl mx-auto mb-3" />
                </motion.div>
                <h4 className="text-[var(--color-text)] font-bold mb-2">Welcome Aboard!</h4>
                <p className="text-[var(--color-text-muted)] text-sm">{message}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
              >
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 group-focus-within:text-[var(--color-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your business email"
                    disabled={status === "loading"}
                    className="w-full bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-[var(--color-text)] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 placeholder-gray-500 disabled:opacity-50"
                  />
                </div>

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center text-red-400 text-xs mt-1"
                  >
                    <FaExclamationCircle className="mr-1.5" /> {message}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[#00BFDE] text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(49,185,143,0.3)] hover:shadow-[0_0_25px_rgba(49,185,143,0.5)] transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 group"
                >
                  {status === "loading" ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span>Join the Network</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterNewsletter;
