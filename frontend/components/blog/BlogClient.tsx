'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import HeroSection from "./HeroSection";
import FeaturedArticles from "./FeaturedArticles";
import SearchFiltering from "./SearchFiltering";
import LatestArticles from "./LatestArticles";
import TrendingTopics from "./TrendingTopics";
import NewsletterSection from "./NewsletterSection";
import useReveal from "@/hooks/useReveal";
import type { BlogArticle } from "@/constants/blogData";
import Image from 'next/image';

export default function BlogClient() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useReveal();

  // Handle article modal
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArticle]);

  const handleExplore = () => {
    const element = document.getElementById('search-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = () => {
    const element = document.getElementById('newsletter-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTag(topic);
    const element = document.getElementById('search-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen">
        {/* Hero Section */}
        <HeroSection
          onExplore={handleExplore}
          onSubscribe={handleSubscribe}
        />

        {/* Featured Articles */}
        <FeaturedArticles
          onArticleClick={setSelectedArticle}
        />

        {/* Search & Filtering */}
        <div id="search-section">
          <SearchFiltering
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSearchChange={setSearchQuery}
            currentCategory={selectedCategory}
            currentTag={selectedTag}
            searchQuery={searchQuery}
          />
        </div>

        {/* Latest Articles */}
        <LatestArticles
          onArticleClick={setSelectedArticle}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
        />

        {/* Trending Topics */}
        <TrendingTopics onTopicClick={handleTopicClick} />

        {/* Newsletter Section */}
        <div id="newsletter-section">
          <NewsletterSection />
        </div>

        {/* Article Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal Content */}
              <motion.div
                className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedArticle(null)}
                  className="sticky top-6 right-6 z-10 p-2 rounded-full transition-all bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text)]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>

                {/* Article Content */}
                <article className="p-8 md:p-12">
                  {/* Featured Image */}
                  <div className="mb-8 rounded-2xl overflow-hidden h-96">
                    <Image
                        src={selectedArticle.image}
                        alt={selectedArticle.title}
                        width={1200}
                        height={600}
                        className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span
                      className="px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                    >
                      {selectedArticle.category}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {selectedArticle.readingTime} read
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {selectedArticle.publishDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[var(--color-text)]"
                  >
                    {selectedArticle.title}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 py-6 border-b border-[var(--color-border)]">
                    <Image
                      src={selectedArticle.author.avatar}
                      alt={selectedArticle.author.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-[var(--color-text)]">
                        {selectedArticle.author.name}
                      </div>
                      <div className="text-[var(--color-text-muted)]">
                        {selectedArticle.author.bio}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg my-8 leading-relaxed text-[var(--color-text-muted)]">
                    {selectedArticle.description}
                  </p>

                  {/* Full Content */}
                  <div className="prose prose-lg max-w-none mb-8 dark:prose-invert">
                    <p className="leading-relaxed text-[var(--color-text-muted)]">
                      {selectedArticle.content}
                    </p>

                    {/* Placeholder for more detailed content */}
                    <p className="leading-relaxed mt-6 text-[var(--color-text-muted)]">
                      This comprehensive article explores key insights and practical strategies to help you succeed in {selectedArticle.category.toLowerCase()}. Whether you're just starting out or looking to optimize your existing approach, you'll find valuable takeaways that you can implement immediately.
                    </p>

                    <p className="leading-relaxed mt-6 text-[var(--color-text-muted)]">
                      Throughout this guide, we'll examine real-world examples, industry trends, and expert recommendations that have proven effective. By the end, you'll have a clear understanding of best practices and actionable steps to take your strategy to the next level.
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-8 pt-8 border-t border-[var(--color-border)]">
                    <div className="flex flex-wrap gap-3">
                      {selectedArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 py-8 border-t border-[var(--color-border)]">
                    <span className="text-[var(--color-text-muted)]">Share this article:</span>
                    <button className="px-4 py-2 rounded-lg font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]">
                      Twitter
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]">
                      LinkedIn
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]">
                      Copy Link
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-8 border-t border-[var(--color-border)]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-text)]">
                        {selectedArticle.views.toLocaleString()}
                      </div>
                      <div className="text-[var(--color-text-muted)]">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-text)]">
                        {selectedArticle.reactions.comments}
                      </div>
                      <div className="text-[var(--color-text-muted)]">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-text)]">
                        {selectedArticle.reactions.likes}
                      </div>
                      <div className="text-[var(--color-text-muted)]">Likes</div>
                    </div>
                  </div>
                </article>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};
