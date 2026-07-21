export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readingTime: string;
  views: number;
  featured: boolean;
  slug: string;
  tags: string[];
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export const BLOG_CATEGORIES = [
  "Web Development",
  "SaaS",
  "Mobile Apps",
  "SEO",
  "Business Growth",
  "Case Studies",
];

export const TRENDING_TOPICS = [
  "SaaS Development",
  "MERN Stack",
  "SEO",
  "Mobile Apps",
  "Startups",
  "Business Growth",
  "Digital Transformation",
  "Python",
  "React",
  "Next.js",
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "3",
    title: "SaaS Architecture Best Practices in 2024",
    description:
      "Explore modern SaaS architecture patterns that enable scalability, security, and exceptional user experiences.",
    content:
      "Modern SaaS applications require thoughtful architecture decisions. In this guide, we explore the latest best practices...",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    author: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Full Stack Developer",
    },
    publishDate: "2024-06-05",
    readingTime: "12 min",
    views: 3245,
    featured: true,
    slug: "saas-architecture-best-practices",
    tags: ["SaaS", "Architecture", "Scalability", "Backend"],
    reactions: {
      likes: 456,
      comments: 62,
      shares: 189,
    },
  },
  {
    id: "4",
    title: "Mastering React Performance Optimization",
    description:
      "Advanced techniques to optimize your React applications for lightning-fast load times and smooth interactions.",
    content:
      "React performance optimization is crucial for modern web applications. Learn advanced memoization and lazy loading...",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356713697-98c78e16bab4?w=800&h=500&fit=crop",
    author: {
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      bio: "React Expert & Frontend Architect",
    },
    publishDate: "2024-06-03",
    readingTime: "9 min",
    views: 2987,
    featured: true,
    slug: "react-performance-optimization",
    tags: ["React", "Performance", "JavaScript", "Frontend"],
    reactions: {
      likes: 398,
      comments: 54,
      shares: 142,
    },
  },
  {
    id: "5",
    title: "SEO Strategy for Enterprise SaaS Products",
    description:
      "Comprehensive SEO strategies specifically designed for SaaS companies to increase organic visibility and lead generation.",
    content:
      "SEO for SaaS requires a different approach than traditional e-commerce. Discover strategies that drive qualified leads...",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1460925895917-aae19e938282?w=800&h=500&fit=crop",
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "SEO Strategist & Digital Marketing Lead",
    },
    publishDate: "2024-06-01",
    readingTime: "11 min",
    views: 2654,
    featured: true,
    slug: "seo-strategy-saas",
    tags: ["SEO", "SaaS", "Marketing", "Growth"],
    reactions: {
      likes: 287,
      comments: 38,
      shares: 95,
    },
  },
  {
    id: "6",
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications efficiently using React Native while maintaining native performance.",
    content:
      "React Native enables developers to build truly cross-platform mobile applications. Learn best practices and patterns...",
    category: "Mobile Apps",
    image: "https://images.unsplash.com/photo-1512941691920-25beb77ce643?w=800&h=500&fit=crop",
    author: {
      name: "Lisa Wang",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Mobile Developer & React Native Expert",
    },
    publishDate: "2024-05-30",
    readingTime: "13 min",
    views: 2341,
    featured: false,
    slug: "react-native-mobile-development",
    tags: ["React Native", "Mobile", "iOS", "Android"],
    reactions: {
      likes: 325,
      comments: 51,
      shares: 124,
    },
  },
  {
    id: "8",
    title: "TypeScript Best Practices for Large-Scale Applications",
    description:
      "Learn advanced TypeScript patterns and best practices for maintaining type safety in enterprise applications.",
    content:
      "TypeScript has become essential for large-scale applications. Discover patterns that scale and maintain code quality...",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Full Stack Engineer",
    },
    publishDate: "2024-05-25",
    readingTime: "10 min",
    views: 2089,
    featured: false,
    slug: "typescript-best-practices",
    tags: ["TypeScript", "JavaScript", "Best Practices", "Backend"],
    reactions: {
      likes: 234,
      comments: 31,
      shares: 78,
    },
  },
  {
    id: "9",
    title: "The Business Case for Digital Transformation",
    description:
      "Why digital transformation is no longer optional and how to execute it successfully in your organization.",
    content:
      "Digital transformation goes beyond technology implementation. It's a fundamental shift in how businesses operate...",
    category: "Business Growth",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    author: {
      name: "Patricia Lee",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Digital Strategy Executive",
    },
    publishDate: "2024-05-22",
    readingTime: "8 min",
    views: 1876,
    featured: false,
    slug: "digital-transformation-business-case",
    tags: ["Digital Transformation", "Business", "Strategy", "Growth"],
    reactions: {
      likes: 198,
      comments: 22,
      shares: 56,
    },
  },
  {
    id: "10",
    title: "API Design Principles for Modern Applications",
    description:
      "Build robust, scalable, and developer-friendly APIs following modern design principles and best practices.",
    content:
      "API design is crucial for modern application architecture. Learn RESTful principles and GraphQL best practices...",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356713697-98c78e16bab4?w=800&h=500&fit=crop",
    author: {
      name: "Kevin Martinez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Backend Architect",
    },
    publishDate: "2024-05-20",
    readingTime: "11 min",
    views: 2145,
    featured: false,
    slug: "api-design-principles",
    tags: ["API", "Backend", "Design", "Architecture"],
    reactions: {
      likes: 267,
      comments: 44,
      shares: 89,
    },
  },
  {
    id: "11",
    title: "Cloud-Native Application Development with Kubernetes",
    description:
      "Master cloud-native architectures and container orchestration for scalable, resilient applications.",
    content:
      "Kubernetes has become the standard for container orchestration. Learn how to build cloud-native applications...",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    author: {
      name: "Sophia Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "DevOps Engineer",
    },
    publishDate: "2024-05-18",
    readingTime: "12 min",
    views: 1923,
    featured: false,
    slug: "kubernetes-cloud-native",
    tags: ["Kubernetes", "Cloud", "DevOps", "Docker"],
    reactions: {
      likes: 289,
      comments: 39,
      shares: 92,
    },
  },
  {
    id: "12",
    title: "Securing Your SaaS Application: A Complete Checklist",
    description:
      "Essential security practices and compliance requirements for SaaS applications in today's threat landscape.",
    content:
      "Security is paramount for SaaS applications. Implement these essential practices to protect user data and comply...",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1633356713697-98c78e16bab4?w=800&h=500&fit=crop",
    author: {
      name: "Robert Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Security Specialist",
    },
    publishDate: "2024-05-15",
    readingTime: "10 min",
    views: 2654,
    featured: false,
    slug: "saas-security-checklist",
    tags: ["Security", "SaaS", "Compliance", "Privacy"],
    reactions: {
      likes: 412,
      comments: 58,
      shares: 167,
    },
  },
];
