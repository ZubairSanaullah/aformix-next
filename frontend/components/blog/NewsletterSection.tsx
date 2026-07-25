'use client';

import { useState, type FormEvent } from "react";
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };


export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();
    setIsLoading(true);

    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setEmail('');
    setIsLoading(false);

    // Reset after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="reveal section-padding relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main Container */}
          <div className="card-premium relative rounded-3xl p-12 md:p-16">
            {/* Content */}
            <motion.div className="text-center mb-12" variants={containerVariants}>
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(49,185,143,0.4)]"
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ rotate: { duration: 0.6 } }}
              >
                <Mail size={32} className="text-white" />
              </motion.div>

              {/* Heading */}
              <motion.h2
                className="heading-2 !mb-4"
                variants={itemVariants}
              >
                Get Industry Insights
              </motion.h2>

              {/* Subheading */}
              <motion.p
                className="text-lg md:text-xl max-w-2xl mx-auto text-[var(--color-text-muted)]"
                variants={itemVariants}
              >
                Join 10,000+ tech professionals and entrepreneurs who receive curated insights on SaaS, digital transformation, and emerging technologies every week.
              </motion.p>
            </motion.div>

            {/* Subscription Form */}
            <motion.form
              onSubmit={handleSubscribe}
              className="max-w-md mx-auto mb-8 relative z-20"
              variants={itemVariants}
            >
              <div className="relative flex flex-col sm:flex-row gap-4">
                {/* Email Input */}
                <div className="flex-1">
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input-field w-full py-4 px-5 text-lg"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || isSubmitted}
                  aria-live="polite"
                  className={`btn-primary flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                    isSubmitted ? '!bg-emerald-500 !text-white' : ''
                  }`}
                  whileHover={{ scale: isSubmitted ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Subscribed!</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Privacy Message */}
              <motion.p
                className="text-sm mt-5 text-center text-[var(--color-text-muted)]"
                variants={itemVariants}
              >
                We respect your privacy. Unsubscribe anytime.
              </motion.p>
            </motion.form>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 pt-8 mt-8 border-t border-[var(--color-border)]"
              variants={containerVariants}
            >
              {[
                { label: '10K+', value: 'Subscribers' },
                { label: '95%', value: 'Open Rate' },
                { label: '2/week', value: 'Newsletter' },
              ].map((stat) => (
                <motion.div
                  key={stat.value}
                  className="text-center"
                  variants={itemVariants}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.label}
                  </div>
                  <div className="text-sm font-medium mt-1 text-[var(--color-text-muted)] uppercase tracking-wide">
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Benefits List */}
            <motion.div
              className="mt-12 grid md:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {[
                {
                  icon: '📧',
                  title: 'Curated Content',
                  description: 'Hand-picked articles and insights delivered to your inbox',
                },
                {
                  icon: '⚡',
                  title: 'Weekly Digest',
                  description: 'Stay updated with the latest trends without information overload',
                },
                {
                  icon: '🎁',
                  title: 'Exclusive Offers',
                  description: 'Get early access to webinars, courses, and special deals',
                },
              ].map((benefit) => (
                <motion.div
                  key={benefit.title}
                  className="p-6 rounded-2xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-md hover:border-primary transition-colors duration-300"
                  variants={itemVariants}
                >
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h4 className="font-bold text-lg mb-2 text-[var(--color-text)]">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
