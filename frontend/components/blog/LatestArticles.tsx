'use client';

import { useMemo } from "react";
import { motion } from "framer-motion";

import BlogCard from "@/components/blog/BlogCard";
import { BLOG_ARTICLES } from "@/constants/blogData";
import type { BlogArticle } from "@/constants/blogData";

interface LatestArticlesProps {
  onArticleClick: (article: BlogArticle) => void;
  searchQuery?: string;
  selectedCategory?: string | null;
  selectedTag?: string | null;
}

export default function LatestArticles({
  onArticleClick,
  searchQuery = "",
  selectedCategory = null,
  selectedTag = null,
}: LatestArticlesProps) {
  
  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || article.category === selectedCategory;

      const matchesTag =
        selectedTag === null || article.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <section className="reveal section-padding relative w-full overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12 flex flex-col gap-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary">
            Latest Articles
          </span>
          <h2 className="heading-2">
            {selectedCategory || selectedTag || searchQuery
              ? `Results for ${selectedCategory || selectedTag || `"${searchQuery}"`}`
              : 'Discover Our Latest Insights'}
          </h2>
          <p className="text-[var(--color-text-muted)] text-lg mx-auto max-w-2xl">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            className="py-20 text-center rounded-3xl border-2 border-dashed card-premium bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-6 text-[var(--color-text-muted)] opacity-50">
              📝
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[var(--color-text)]">
              No Articles Found
            </h3>
            <p className="text-[var(--color-text-muted)] text-lg">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}

        {/* Masonry Grid */}
        {filteredArticles.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1 }}
                className="h-full"
              >
                <BlogCard
                  article={article}
                  onArticleClick={onArticleClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              type= "button"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Articles
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
