'use client';

import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { BLOG_CATEGORIES, TRENDING_TOPICS } from '../../constants/blogData';

interface SearchFilteringProps {
  onCategoryChange: (category: string | null) => void;
  onTagChange: (tag: string | null) => void;
  onSearchChange: (query: string) => void;
  currentCategory: string | null;
  currentTag: string | null;
  searchQuery: string;
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

export default function SearchFiltering({
  onCategoryChange,
  onTagChange,
  onSearchChange,
  currentCategory,
  currentTag,
  searchQuery,
}: SearchFilteringProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className="reveal section-padding relative w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="card-premium"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="mb-8 relative">
            <div
              className={`relative flex items-center transition-all duration-300 rounded-2xl border-2 ${
                isSearchFocused
                  ? 'border-primary shadow-[0_0_15px_rgba(49,185,143,0.3)] bg-[var(--color-bg)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)]'
              }`}
            >
              <div className="pl-6 py-4">
                <Search
                  size={20}
                  aria-hidden="true"
                  className={isSearchFocused ? 'text-primary' : 'text-[var(--color-text-muted)]'}
                />
              </div>
              <input
                type="text"
                autoComplete="off"
                spellCheck={false}
                aria-label="Search blog articles"
                placeholder="Search articles by title, keyword, or author..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full h-full py-4 px-4 bg-transparent outline-none text-lg font-medium placeholder-gray-400 text-[var(--color-text)]"
              />
              {searchQuery && (
                <motion.button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange('')}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="p-2 mr-4 rounded-lg hover:bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-pointer"
                >
                  <X size={20} aria-hidden="true" />
                </motion.button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl shadow-2xl border bg-[var(--color-surface-elevated)] border-[var(--color-border)] z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-[var(--color-text-muted)]">
                    Popular Searches
                  </div>
                  <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                    {TRENDING_TOPICS.slice(0, 5).map((topic) => (
                      <motion.button
                        type="button"
                        key={topic}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur
                          onSearchChange(topic);
                          setIsSearchFocused(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                        variants={itemVariants}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Toggle */}
          <motion.button
            type="button"
            aria-expanded={showFilters}
            id="blog-filters"
            aria-controls="blog-filters"
            onClick={() => setShowFilters(prev => !prev)}
            className="mb-6 px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-border)] border border-[var(--color-border)] cursor-pointer flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showFilters ? '✕ Hide Filters' : '+ Show Filters'}
          </motion.button>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Filters */}
                <div>
                  <motion.h3
                    className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-text-muted)]"
                    variants={itemVariants}
                  >
                    Categories
                  </motion.h3>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {BLOG_CATEGORIES.map((category) => (
                      <motion.button
                        type="button"
                        key={category}
                        onClick={() =>
                          onCategoryChange(currentCategory === category ? null : category)
                        }
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border-2 cursor-pointer ${
                          currentCategory === category
                            ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(49,185,143,0.3)]'
                            : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-primary hover:text-[var(--color-text)]'
                        }`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Tag Filters */}
                <div>
                  <motion.h3
                    className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-text-muted)]"
                    variants={itemVariants}
                  >
                    Topics
                  </motion.h3>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {TRENDING_TOPICS.map((topic) => (
                      <motion.button
                        type="button"
                        key={topic}
                        onClick={() =>
                          onTagChange(currentTag === topic ? null : topic)
                        }
                        className={`px-3 py-1 rounded-full font-medium text-xs transition-all duration-300 border-2 cursor-pointer ${
                          currentTag === topic
                            ? 'bg-accent text-white border-accent shadow-[0_0_15px_rgba(0,191,222,0.3)]'
                            : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-accent hover:text-[var(--color-text)]'
                        }`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Active Filters Display */}
                {(currentCategory || currentTag || searchQuery) && (
                  <motion.div
                    layout
                    className="flex flex-wrap items-center gap-2 pt-6 mt-2 border-t border-[var(--color-border)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span
                      className="text-xs font-semibold uppercase text-[var(--color-text-muted)]"
                    >
                      Active Filters:
                    </span>
                    {searchQuery && (
                      <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {searchQuery}
                        <button aria-label="Remove search filter" type="button" onClick={() => onSearchChange('')} className="hover:opacity-70 cursor-pointer">
                          ✕
                        </button>
                      </motion.div>
                    )}
                    {currentCategory && (
                      <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {currentCategory}
                        <button aria-label="Remove category filter" type="button" onClick={() => onCategoryChange(null)} className="hover:opacity-70 cursor-pointer">
                          ✕
                        </button>
                      </motion.div>
                    )}
                    {currentTag && (
                      <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {currentTag}
                        <button aria-label="Remove topic filter" type="button" onClick={() => onTagChange(null)} className="hover:opacity-70 cursor-pointer">
                          ✕
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};