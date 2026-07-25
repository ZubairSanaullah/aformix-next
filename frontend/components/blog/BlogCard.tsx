'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageCircle, Share2, Heart, BookmarkPlus } from 'lucide-react';
import type { BlogArticle } from "@/constants/blogData";
import Image from "next/image";

interface BlogCardProps {
  article: BlogArticle;
  onArticleClick: (article: BlogArticle) => void;
  variant?: 'grid' | 'list';
}

export default function BlogCard({
  article,
  onArticleClick,
  variant = "grid",
}: BlogCardProps) {

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.reactions.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Share functionality
  };

  if (variant === 'list') {
    return (
      <motion.div
        onClick={() => onArticleClick(article)}
        className="group cursor-pointer flex gap-6 p-5 portfolio-card !rounded-[2rem]"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Image */}
        <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-purple-600">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={500}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary"
              >
                {article.category}
              </span>
              <span
                className="text-xs font-medium text-[var(--color-text-muted)]"
              >
                {article.readingTime}
              </span>
            </div>

            <h3
              className="text-xl font-bold mb-2 line-clamp-2 text-[var(--color-text)]"
            >
              {article.title}
            </h3>

            <p
              className="line-clamp-2 mb-4 text-[var(--color-text-muted)]"
            >
              {article.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={32}
                height={32}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover border border-emerald-500"
              />
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {article.author.name}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] opacity-80">
                  {article.publishDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <Eye size={16} />
              <span className="text-sm">{article.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant
  return (
    <motion.div
      onClick={() => onArticleClick(article)}
      className="group cursor-pointer portfolio-card flex flex-col h-full !rounded-[2rem]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-400 to-purple-600">
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={500}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category Badge */}
        <motion.div
          className="absolute top-4 left-4 right-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
          >
            {article.category}
          </span>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            {article.readingTime}
          </span>
        </motion.div>

        {/* Actions Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-end p-4"
          initial={false}
        >
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isLiked
                  ? 'bg-red-500/80 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileTap={{ scale: 0.8 }}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              onClick={handleBookmark}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-emerald-500/80 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              whileTap={{ scale: 0.8 }}
            >
              <BookmarkPlus size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="p-2 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white/30 transition-all cursor-pointer"
              whileTap={{ scale: 0.8 }}
            >
              <Share2 size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3
          className="font-bold text-lg mb-3 line-clamp-2 text-[var(--color-text)]"
        >
          {article.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm line-clamp-2 mb-4 text-[var(--color-text-muted)]"
        >
          {article.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
            >
              #{tag}
            </span>
          ))}
          {article.tags.length > 2 && (
            <span
              className="text-xs px-2 py-1 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
            >
              +{article.tags.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className="pt-4 border-t border-[var(--color-border)]"
        >
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={32}
                height={32}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="text-xs font-semibold text-[var(--color-text)]">
                  {article.author.name.split(' ')[0]}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {article.publishDate}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{(article.views / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{article.reactions.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};