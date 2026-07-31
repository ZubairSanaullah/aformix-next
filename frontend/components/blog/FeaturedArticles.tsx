import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import type { BlogArticle } from "@/constants/blogData";
import { BLOG_ARTICLES } from "@/constants/blogData";
import Image from "next/image";

interface FeaturedArticlesProps {
  onArticleClick: (article: BlogArticle) => void;
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ onArticleClick }) => {
  const featured = BLOG_ARTICLES.filter(a => a.featured);

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

  const featuredMain = featured[0];
  if (!featuredMain) return null;

  return (
    <section className="reveal section-padding relative w-full overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12 flex flex-col gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <motion.span
              className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block"
              variants={itemVariants}
            >
              Featured Stories
            </motion.span>
            <motion.h2
              className="heading-2 !text-left !mb-4"
              variants={itemVariants}
            >
              Magazine-Style Selection
            </motion.h2>
            <motion.p
              className="text-[var(--color-text-muted)] max-w-2xl text-lg"
              variants={itemVariants}
            >
              Our carefully curated selection of premium articles on technology, business, and innovation
            </motion.p>
          </div>
        </motion.div>

        {/* Featured Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Large Featured Article */}
          {featuredMain && (
            <motion.div
              className="lg:col-span-2 h-full"
              variants={itemVariants}
            >
              <div
                className="group portfolio-card h-full cursor-pointer flex flex-col justify-end"
                onClick={() => onArticleClick(featuredMain)}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  <Image
                    src={featuredMain.image}
                    alt={featuredMain.title}
                    fill
                    sizes="(max-width:768px) 100vw, 66vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 md:p-12 flex flex-col h-full justify-between mt-48">
                  <div className="flex items-start justify-between">
                    <span className="px-4 py-2 bg-primary/90 backdrop-blur text-white text-sm font-semibold rounded-full shadow-lg">
                      {featuredMain.category}
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20">
                      {featuredMain.readingTime} read
                    </span>
                  </div>

                  <div className="space-y-6 mt-auto pt-8">
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {featuredMain.title}
                    </h3>

                    <p className="text-gray-300 text-lg line-clamp-2">
                      {featuredMain.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <Image
                          src={featuredMain.author.avatar}
                          alt={featuredMain.author.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                        />
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {featuredMain.author.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {featuredMain.publishDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                          <Eye size={16} />
                          <span className="text-sm font-medium">{featuredMain.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Smaller Featured Articles Stack */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
          >
            {featured.slice(1, 4).map((article) => (
              <motion.div
                key={article.id}
                className="group portfolio-card cursor-pointer p-5 flex flex-col gap-4 !rounded-[2rem]"
                onClick={() => onArticleClick(article)}
                variants={itemVariants}
              >
                {/* Small Image */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {article.category}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      {article.readingTime}
                    </span>
                  </div>

                  <h4 className="font-bold text-lg line-clamp-2 text-[var(--color-text)] group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h4>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={28}
                        height={28}
                        loading="lazy"
                        className="w-7 h-7 rounded-full object-cover border border-[var(--color-border)]"
                      />
                      <span className="text-sm font-medium text-[var(--color-text-muted)]">
                        {article.author.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] bg-[var(--color-glass)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                      <Eye size={14} />
                      <span className="text-xs font-medium">{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* View All Button */}
        {/* <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default FeaturedArticles;
