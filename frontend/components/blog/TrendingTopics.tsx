'use client';

import { motion } from 'framer-motion';
import { TRENDING_TOPICS } from '@/constants/blogData';

interface TrendingTopicsProps {
  onTopicClick: (topic: string) => void;
}


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

const TOPIC_ICONS = [
  "🤖",
  "🛠️",
  "💡",
  "📱",
  "🔍",
  "📈",
  "🚀",
  "🔐",
  "⚙️",
  "💻",
];

export default function TrendingTopics({
  onTopicClick,
}: TrendingTopicsProps) {

  // Add view counts and icons to trending topics
  const topicsWithMetrics = TRENDING_TOPICS.map((topic, index) => ({
  topic,
  views: 2000 + index * 850,
  trend: index % 2 === 0 ? "up" : "down",
  progress: Math.min(35 + index * 6, 100),
  icon: TOPIC_ICONS[index % TOPIC_ICONS.length]
}));

  return (
    <section className="reveal section-padding relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-accent">
            What's Hot
          </span>
          <h2 className="heading-2">
            Trending Topics
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[var(--color-text-muted)]">
            Explore the most talked-about topics in technology, business, and innovation
          </p>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {topicsWithMetrics.map((item) => (
            <motion.button
              type="button"
              key={item.topic}
              onClick={() => onTopicClick(item.topic)}
              className="relative group p-6 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg hover:border-accent hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,191,222,0.15)] flex flex-col"
              variants={itemVariants}
            >
              {/* Background Gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-emerald-500/0 group-hover:from-cyan-500/10 group-hover:to-emerald-500/10 transition-all duration-500"
              />

              {/* Content */}
              <div className="relative z-10 w-full flex flex-col flex-1 text-left">
                {/* Icon & Trend */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      item.trend === 'up'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    }`}
                  >
                    {item.trend === 'up' ? '↑ Trending' : '→ Hot'}
                  </span>
                </div>

                {/* Topic Name */}
                <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">
                  {item.topic}
                </h3>

                {/* Views */}
                <p className="text-sm font-medium mb-4 text-[var(--color-text-muted)]">
                  {Math.round(item.views / 100)} articles
                </p>

                {/* Progress Bar */}
                <div className="h-1.5 w-full rounded-full overflow-hidden bg-[var(--color-bg)] mt-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Tags Cloud Alternative View */}
        <motion.div
          className="mt-24 pt-16 border-t border-[var(--color-border)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-[var(--color-text)]">
            All Topics
          </h3>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TRENDING_TOPICS.map((topic) => (
              <motion.button
                type="button"
                key={topic}
                onClick={() => onTopicClick(topic)}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 border bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-accent hover:text-accent cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,191,222,0.1)]"
                variants={itemVariants}
              >
                {topic}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};