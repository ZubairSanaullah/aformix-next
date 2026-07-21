import type { ServiceData } from "../types/service";
import {
  Zap,
  Code,
  Server,
  Database,
  Search,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  BarChart,
  Users,
  Building,
  Briefcase,
  Monitor,
  Layout,
  ShieldCheck,
  Rocket,
  Clock,
  ThumbsUp,
  Cpu,
  Layers,
  Settings,
  TrendingUp,
  Lock,
  RefreshCw,
  Target,
  Package,
  Star,
  MessageSquare,
  FileText,
  Activity,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  DollarSign,
  PlugZap,
  Share2,
  Eye,
  Award,
  GitBranch,
  CheckSquare,
  Sliders,
} from "lucide-react";

export const servicesData: Record<string, ServiceData> = {
  /* ─────────────────────── 1. CUSTOM DEVELOPMENT ─────────────────────── */
  "custom-development": {
    id: "custom-development",
    title: "Custom Web Development",
    badge: "Bespoke Digital Solutions",
    heroHeadline: "Software Engineered Precisely for Your Business",
    heroDescription:
      "Off-the-shelf software limits your potential. We build fully custom web solutions from the ground up, designed around your exact workflows, brand, and growth ambitions.",
    seo: {
      title: "Custom Web Development Services | Aformix",
      description:
        "Aformix builds bespoke, high-performance custom web applications tailored to your unique business requirements. Contact us for a free consultation.",
      keywords: "Custom Web Development, Bespoke Software, Custom Application, Web App Development, Software Development Company",
    },
    problems: [
      {
        id: "p1",
        title: "Generic Software Doesn't Fit",
        description:
          "Off-the-shelf tools force you to adapt your processes to the software instead of the other way around.",
        icon: Settings,
      },
      {
        id: "p2",
        title: "Vendor Lock-In & Rising Costs",
        description:
          "Monthly SaaS fees compound, and you have zero control over features, data ownership, or platform changes.",
        icon: Lock,
      },
      {
        id: "p3",
        title: "Impossible to Scale",
        description:
          "Packaged solutions hit ceilings — they can't be extended to meet your unique scaling requirements.",
        icon: TrendingUp,
      },
    ],
    solution: {
      title: "Own Your Software, Own Your Growth",
      description:
        "We design and engineer custom applications that are an exact fit for your business model. You own 100% of the code, the data, and the roadmap — with no recurring platform fees.",
      benefits: [
        "100% custom-fit to your business logic",
        "Full source code ownership",
        "No vendor lock-in",
        "Built to scale as you grow",
      ],
    },
    features: [
      {
        id: "f1",
        title: "Requirement Engineering",
        description: "Deep discovery sessions to translate your business needs into precise technical specifications.",
        icon: ClipboardList,
      },
      {
        id: "f2",
        title: "Scalable Architecture",
        description: "Microservices and cloud-native designs built to handle millions of users without rework.",
        icon: Layers,
      },
      {
        id: "f3",
        title: "API-First Development",
        description: "Every system we build exposes clean APIs, making future integrations seamless.",
        icon: Globe,
      },
      {
        id: "f4",
        title: "Rigorous QA & Testing",
        description: "Automated test suites ensure every feature works flawlessly before it reaches your users.",
        icon: CheckSquare,
      },
    ],
    benefits: [
      {
        id: "b1",
        title: "Eliminate Recurring Fees",
        description: "A one-time custom build often breaks even within 18 months vs. perpetual SaaS subscriptions.",
        metric: "0",
        metricLabel: "Monthly SaaS Fees",
      },
      {
        id: "b2",
        title: "Perfect Process Fit",
        description: "Software that works exactly the way your team works — zero compromises.",
        metric: "100%",
        metricLabel: "Custom Fit",
      },
      {
        id: "b3",
        title: "Competitive Advantage",
        description: "Your competitors can't buy your proprietary tools — they're yours alone.",
        metric: "Unique",
        metricLabel: "Competitive Edge",
      },
    ],
    process: [
      { id: "pr1", title: "Discovery", description: "Deep-dive into your business goals, pain points, and user journeys.", icon: Search },
      { id: "pr2", title: "System Design", description: "Crafting technical architecture, database schemas, and UI wireframes.", icon: Layers },
      { id: "pr3", title: "Agile Development", description: "Iterative sprints with regular demos and feedback loops.", icon: Code },
      { id: "pr4", title: "Launch & Support", description: "Smooth production deployment with ongoing maintenance SLAs.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: [
          { name: "React / Next.js", icon: Code },
          { name: "TypeScript", icon: Code },
          { name: "Tailwind CSS", icon: Layout },
        ],
      },
      {
        category: "Backend & Infrastructure",
        technologies: [
          { name: "Node.js", icon: Server },
          { name: "PostgreSQL", icon: Database },
          { name: "AWS / GCP", icon: Server },
          { name: "Docker", icon: Package },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Custom Fleet Management Platform",
        client: "LogiTrack Ltd",
        challenge: "Existing fleet software lacked critical features for their cross-border operations and API integrations.",
        solution: "Built a custom platform with real-time GPS tracking, automated route optimization, and driver scoring.",
        results: [
          { label: "Fuel Cost Savings", value: "22%" },
          { label: "On-Time Deliveries", value: "+18%" },
        ],
      },
    ],
    faqs: [
      {
        id: "faq1",
        question: "How much does custom development cost?",
        answer: "Custom projects are priced based on scope, complexity, and timeline. We provide detailed proposals after a free discovery call. Typical projects range from $8k for MVPs to $100k+ for enterprise platforms.",
      },
      {
        id: "faq2",
        question: "How long does a custom project take?",
        answer: "MVPs can be delivered in 6–10 weeks. Full-featured enterprise applications typically take 4–9 months depending on complexity.",
      },
      {
        id: "faq3",
        question: "What happens after the project is launched?",
        answer: "We offer ongoing maintenance, performance monitoring, and feature development retainers so your software continuously evolves with your business.",
      },
    ],
    ctaHeadline: "Let's Build Something Extraordinary",
    ctaDescription: "Tell us about your vision. We'll engineer it into reality — exactly as you imagined.",
  },

  /* ─────────────────────── 3. MERN STACK ─────────────────────── */
  "mern-stack-development": {
    id: "mern-stack-development",
    title: "MERN Stack Development",
    badge: "Full-Stack JavaScript Solutions",
    heroHeadline: "Scalable Web Applications Built with MERN",
    heroDescription:
      "We build blazing-fast, highly scalable web applications using MongoDB, Express.js, React, and Node.js. A unified JavaScript architecture for unparalleled performance.",
    seo: {
      title: "MERN Stack Development Services | Aformix",
      description: "Expert MERN stack developers at Aformix. Scalable, high-performance web apps built with MongoDB, Express, React, and Node.js.",
      keywords: "MERN Stack, React JS, Node JS, MongoDB, Express JS, Full Stack Development, JavaScript Developer",
    },
    problems: [
      { id: "p1", title: "Slow Application Performance", description: "Your current app takes too long to load, resulting in high bounce rates and frustrated users.", icon: Clock },
      { id: "p2", title: "Inability to Scale", description: "Your architecture crashes under traffic spikes and can't grow with your user base.", icon: Server },
      { id: "p3", title: "Complex, Fragmented Codebase", description: "Mixing different languages for frontend and backend creates maintenance nightmares.", icon: Settings },
    ],
    solution: {
      title: "The Power of a Unified JavaScript Stack",
      description: "By using JavaScript across the entire stack, we ensure rapid development, seamless JSON data flow, and a codebase any JS developer can jump into — reducing your bus factor.",
      benefits: ["Single language across the entire stack", "Blazing-fast React frontend", "Flexible NoSQL data modeling", "Non-blocking Node.js backend"],
    },
    features: [
      { id: "f1", title: "React SPA & SSR", description: "Dynamic single-page apps or server-side rendered pages for maximum SEO and performance.", icon: Layout },
      { id: "f2", title: "RESTful & GraphQL APIs", description: "Scalable Express.js APIs delivering exactly the data your clients need.", icon: Globe },
      { id: "f3", title: "MongoDB Data Modeling", description: "Flexible schemas designed for your data's natural structure, not forced into rigid tables.", icon: Database },
      { id: "f4", title: "Real-Time with Socket.io", description: "Live updates, chat, notifications, and collaborative features built right in.", icon: Zap },
    ],
    benefits: [
      { id: "b1", title: "Faster Delivery", description: "One language across the stack means less context-switching and faster shipping.", metric: "30%", metricLabel: "Faster Delivery" },
      { id: "b2", title: "Performance Boost", description: "React's virtual DOM + Node.js's event loop = lightning-fast user experiences.", metric: "2x", metricLabel: "Performance" },
      { id: "b3", title: "Cost-Efficient Scaling", description: "Independently scale frontend, backend, and DB without costly rewrites.", metric: "100%", metricLabel: "Cloud Scalable" },
    ],
    process: [
      { id: "pr1", title: "Architecture Planning", description: "Defining schema, API contracts, and component hierarchy.", icon: Layers },
      { id: "pr2", title: "Backend Development", description: "Node/Express server, MongoDB setup, authentication & authorization.", icon: Server },
      { id: "pr3", title: "Frontend Development", description: "React UI connected to the API with state management and animations.", icon: Code },
      { id: "pr4", title: "Testing & CI/CD", description: "Jest tests, integration tests, and automated deployment pipelines.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: [
          { name: "React.js", icon: Code },
          { name: "Redux / Zustand", icon: Layers },
          { name: "Tailwind CSS", icon: Layout },
          { name: "Framer Motion", icon: Zap },
        ],
      },
      {
        category: "Backend & Database",
        technologies: [
          { name: "Node.js", icon: Server },
          { name: "Express.js", icon: Code },
          { name: "MongoDB", icon: Database },
          { name: "Mongoose ODM", icon: Database },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Real-Time E-Learning Platform",
        client: "EduTech Global",
        challenge: "Needed to host 10,000+ concurrent students with live video, chat, and quizzing.",
        solution: "Built a MERN application with Socket.io for real-time features, optimized MongoDB aggregations, and CDN-delivered content.",
        results: [
          { label: "Concurrent Users", value: "10,000+" },
          { label: "Platform Uptime", value: "99.99%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Why choose MERN over other tech stacks?", answer: "MERN uses JavaScript end-to-end. Data flows as JSON from MongoDB through Express and Node to your React frontend — eliminating unnecessary transformation layers and dramatically simplifying development." },
      { id: "faq2", question: "Is MongoDB good for structured data?", answer: "Yes. Modern MongoDB supports multi-document transactions, schema validation, and joins (via $lookup). It's powerful for both flexible and structured data models." },
      { id: "faq3", question: "Can you migrate my existing app to MERN?", answer: "Absolutely. We can incrementally migrate legacy systems to MERN, starting with the most critical components while keeping your existing app operational." },
    ],
    ctaHeadline: "Build Your Next Big Idea on MERN",
    ctaDescription: "Let's architect your scalable, high-performance web application together.",
  },

  /* ─────────────────────── 4. FULL STACK SOLUTIONS ─────────────────────── */
  "full-stack-solutions": {
    id: "full-stack-solutions",
    title: "Full Stack Solutions",
    badge: "End-to-End Development",
    heroHeadline: "Complete Digital Products, Front to Back",
    heroDescription:
      "From pixel-perfect UIs to robust server infrastructure, Aformix delivers complete full-stack solutions. One team, one vision, zero gaps.",
    seo: {
      title: "Full Stack Development Solutions | Aformix",
      description: "Aformix provides end-to-end full stack development services — from UI design to backend APIs and cloud infrastructure.",
      keywords: "Full Stack Development, End-to-End Development, Web App, React, Node.js, Full Stack Team",
    },
    problems: [
      { id: "p1", title: "Coordination Overhead", description: "Managing separate frontend and backend teams creates communication bottlenecks and misaligned expectations.", icon: Users },
      { id: "p2", title: "Integration Failures", description: "When frontend and backend are built in silos, critical integration issues surface late in development — costing time and money.", icon: PlugZap },
      { id: "p3", title: "Inconsistent Code Quality", description: "Multiple teams with different standards produce an inconsistent codebase that's hard to maintain.", icon: GitBranch },
    ],
    solution: {
      title: "One Team. Total Ownership.",
      description: "Our full-stack teams own the entire product — from database design to UI animation. This eliminates coordination overhead, speeds delivery, and guarantees cohesion at every layer.",
      benefits: ["Single point of accountability", "Seamless frontend-backend integration", "Consistent code standards throughout", "Faster iteration cycles"],
    },
    features: [
      { id: "f1", title: "UI/UX Design", description: "Stunning, user-tested interfaces built before a single line of code is written.", icon: PenTool },
      { id: "f2", title: "API Architecture", description: "RESTful and GraphQL APIs designed for performance, security, and extensibility.", icon: Globe },
      { id: "f3", title: "Database Engineering", description: "Optimized SQL and NoSQL databases with proper indexing and query optimization.", icon: Database },
      { id: "f4", title: "DevOps & Cloud", description: "Containerized deployments on AWS, GCP, or Azure with CI/CD pipelines.", icon: Server },
    ],
    benefits: [
      { id: "b1", title: "Faster Time-to-Market", description: "Integrated teams ship 40% faster than siloed frontend/backend structures.", metric: "40%", metricLabel: "Faster Delivery" },
      { id: "b2", title: "Cost Savings", description: "One team is significantly cheaper than hiring and coordinating multiple specialized agencies.", metric: "35%", metricLabel: "Cost Savings" },
      { id: "b3", title: "Higher Quality", description: "A unified team produces more cohesive, maintainable software.", metric: "5★", metricLabel: "Code Quality" },
    ],
    process: [
      { id: "pr1", title: "Discovery & Planning", description: "Full product mapping from user stories to technical architecture.", icon: Search },
      { id: "pr2", title: "Design Sprint", description: "Wireframes, mockups, and design system before development begins.", icon: PenTool },
      { id: "pr3", title: "Full-Stack Build", description: "Concurrent frontend and backend development in synchronized sprints.", icon: Code },
      { id: "pr4", title: "Deploy & Scale", description: "Production launch with monitoring, alerting, and scale-ready infrastructure.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Full Stack",
        technologies: [
          { name: "Next.js", icon: Code }, { name: "React", icon: Code }, { name: "TypeScript", icon: Code },
          { name: "Node.js", icon: Server }, { name: "PostgreSQL", icon: Database }, { name: "Redis", icon: Database },
        ],
      },
      {
        category: "Infrastructure",
        technologies: [
          { name: "AWS / GCP", icon: Server }, { name: "Docker", icon: Package }, { name: "GitHub Actions", icon: GitBranch },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Enterprise HR Platform Rebuild",
        client: "PeopleOps Inc",
        challenge: "Legacy HR system built over 8 years was unmaintainable and couldn't integrate modern payroll APIs.",
        solution: "Complete full-stack rebuild with a React frontend, Node.js API layer, PostgreSQL, and direct integration with 3rd-party payroll providers.",
        results: [
          { label: "Load Time Improvement", value: "6x" },
          { label: "New Feature Velocity", value: "+200%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "What does 'full stack' mean exactly?", answer: "Full stack development covers the entire software stack: the user interface (frontend), the server and business logic (backend), the database, and the cloud infrastructure hosting it all." },
      { id: "faq2", question: "Do you work on existing codebases?", answer: "Yes. We can extend, refactor, and modernize existing codebases in addition to building from scratch." },
    ],
    ctaHeadline: "One Team to Build Your Entire Product",
    ctaDescription: "Get a complete product built by a single cohesive team. No gaps, no blame games.",
  },

  /* ─────────────────────── 5. SAAS DEVELOPMENT ─────────────────────── */
  "saas-development": {
    id: "saas-development",
    title: "SaaS Application Development",
    badge: "Recurring Revenue Platforms",
    heroHeadline: "Launch Your SaaS Product with Confidence",
    heroDescription:
      "We engineer multi-tenant SaaS platforms built for growth — with subscription billing, user management, analytics dashboards, and the scalability to support thousands of users from day one.",
    seo: {
      title: "SaaS Application Development | Aformix",
      description: "Build a scalable SaaS product with Aformix. We develop multi-tenant platforms with billing, auth, analytics, and enterprise-grade architecture.",
      keywords: "SaaS Development, SaaS Platform, Multi-Tenant App, Subscription Software, SaaS Builder",
    },
    problems: [
      { id: "p1", title: "Complex Multi-Tenancy", description: "Building a secure, isolated environment for each customer is architecturally complex and easy to get wrong.", icon: Building },
      { id: "p2", title: "Subscription Billing Headaches", description: "Integrating recurring billing, trials, upgrades, and invoicing is a rabbit hole that derails product teams.", icon: DollarSign },
      { id: "p3", title: "Scaling Blind Spots", description: "Apps that work for 100 users often catastrophically fail at 10,000 — without the right architecture from the start.", icon: TrendingUp },
    ],
    solution: {
      title: "SaaS Architecture Done Right, From Day One",
      description: "We apply battle-tested SaaS architectural patterns from the beginning — multi-tenant data isolation, Stripe billing integration, role-based access, and horizontal scalability — so you can grow without technical debt.",
      benefits: ["Secure multi-tenant architecture", "Stripe / Paddle billing integration", "Role-based access control (RBAC)", "Usage analytics & feature flags"],
    },
    features: [
      { id: "f1", title: "Multi-Tenant Architecture", description: "Secure data isolation for each customer, built at the database level.", icon: ShieldCheck },
      { id: "f2", title: "Subscription Management", description: "Flexible billing with Stripe — trials, plans, upgrades, and invoices.", icon: DollarSign },
      { id: "f3", title: "Admin Dashboard", description: "Real-time analytics, user management, and product metrics at a glance.", icon: BarChart },
      { id: "f4", title: "Self-Serve Onboarding", description: "Frictionless signup flows that get customers to 'aha moment' in minutes.", icon: Users },
    ],
    benefits: [
      { id: "b1", title: "Recurring Revenue Model", description: "Build a predictable, compounding revenue stream from subscription customers.", metric: "MRR", metricLabel: "Recurring Revenue" },
      { id: "b2", title: "Low Churn Architecture", description: "Great UX and reliable performance translate directly into customer retention.", metric: "< 5%", metricLabel: "Avg. Churn Rate" },
      { id: "b3", title: "Ready to Scale", description: "Cloud-native infrastructure designed to handle 10x traffic without code changes.", metric: "∞", metricLabel: "Scalable Users" },
    ],
    process: [
      { id: "pr1", title: "Product Strategy", description: "Defining ICP, core features, pricing model, and go-to-market plan.", icon: Target },
      { id: "pr2", title: "Architecture Design", description: "Multi-tenancy model, database design, API contracts, and auth strategy.", icon: Layers },
      { id: "pr3", title: "MVP Build", description: "Core features shipped fast so you can get to market and gather real feedback.", icon: Code },
      { id: "pr4", title: "Iterate & Scale", description: "Analytics-driven iteration and infrastructure scaling as users grow.", icon: TrendingUp },
    ],
    techStack: [
      {
        category: "Application",
        technologies: [
          { name: "Next.js", icon: Code }, { name: "React", icon: Code }, { name: "Node.js", icon: Server }, { name: "PostgreSQL", icon: Database },
        ],
      },
      {
        category: "SaaS Infrastructure",
        technologies: [
          { name: "Stripe", icon: DollarSign }, { name: "Auth0 / Clerk", icon: ShieldCheck }, { name: "Vercel / AWS", icon: Server }, { name: "Posthog Analytics", icon: BarChart },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "B2B Project Management SaaS",
        client: "Taskwise",
        challenge: "Founder had a validated idea but no technical co-founder to build the product.",
        solution: "Built the full SaaS product — multi-tenant data model, Stripe billing, team collaboration features, and a beautiful React dashboard.",
        results: [
          { label: "MRR at 6 Months", value: "$18K" },
          { label: "Enterprise Clients", value: "12" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "How long does it take to build a SaaS MVP?", answer: "A well-scoped SaaS MVP with core features, auth, and billing typically takes 8–14 weeks to build and launch." },
      { id: "faq2", question: "Do you help with SaaS product strategy?", answer: "Yes. We offer pre-development workshops to help define your target customer, feature set, pricing model, and go-to-market strategy." },
    ],
    ctaHeadline: "Let's Build Your Next SaaS Product",
    ctaDescription: "Book a free SaaS strategy session and leave with a clear product roadmap.",
  },

  /* ─────────────────────── 6. MOBILE APP DEVELOPMENT ─────────────────────── */
  "mobile-app-development": {
    id: "mobile-app-development",
    title: "Mobile App Development",
    badge: "iOS & Android Applications",
    heroHeadline: "Mobile Apps Your Users Will Love",
    heroDescription:
      "We craft high-performance, native-feel mobile applications for iOS and Android using React Native. One codebase, two platforms, beautiful experiences.",
    seo: {
      title: "Mobile App Development Services | Aformix",
      description: "Expert iOS & Android app development by Aformix using React Native. Build cross-platform mobile apps with native performance and beautiful UX.",
      keywords: "Mobile App Development, iOS App, Android App, React Native, Cross-Platform App, App Developer",
    },
    problems: [
      { id: "p1", title: "Double Development Cost", description: "Building separate native apps for iOS and Android doubles your budget and timeline.", icon: DollarSign },
      { id: "p2", title: "Poor App Store Ratings", description: "Buggy, slow, or confusing apps get 1-star reviews that kill your acquisition funnel.", icon: Star },
      { id: "p3", title: "Slow Development Cycles", description: "Long app release cycles mean your users wait months for new features and bug fixes.", icon: Clock },
    ],
    solution: {
      title: "One Codebase. Two World-Class Apps.",
      description: "Using React Native, we build a single codebase that delivers near-native performance on both iOS and Android. This cuts your development cost by up to 40% while maintaining exceptional user experiences.",
      benefits: ["iOS & Android from one codebase", "Native performance & feel", "Over-the-air updates without App Store approval", "Shared backend with web apps"],
    },
    features: [
      { id: "f1", title: "Cross-Platform Development", description: "React Native apps running on both platforms from a single, maintainable codebase.", icon: Smartphone },
      { id: "f2", title: "Native Device Features", description: "Camera, GPS, push notifications, biometrics — full access to device hardware.", icon: Cpu },
      { id: "f3", title: "Offline Capability", description: "Apps that work without internet and sync seamlessly when reconnected.", icon: RefreshCw },
      { id: "f4", title: "App Store Submission", description: "Full support for App Store and Google Play submission, guidelines, and approval.", icon: CheckSquare },
    ],
    benefits: [
      { id: "b1", title: "Cost Savings", description: "Cross-platform development costs significantly less than building two separate native apps.", metric: "40%", metricLabel: "Cost Savings" },
      { id: "b2", title: "Faster Release", description: "Ship features to iOS and Android simultaneously, cutting your release cycle in half.", metric: "2x", metricLabel: "Faster Releases" },
      { id: "b3", title: "User Retention", description: "Smooth, native-feel experiences drive higher user retention and App Store ratings.", metric: "4.8★", metricLabel: "Avg. Store Rating" },
    ],
    process: [
      { id: "pr1", title: "Discovery & UX", description: "Understanding user journeys and creating wireframes and prototypes.", icon: Search },
      { id: "pr2", title: "UI Design", description: "Platform-specific design language — following iOS HIG and Material Design.", icon: PenTool },
      { id: "pr3", title: "Development", description: "Agile sprints building features with continuous testing on real devices.", icon: Code },
      { id: "pr4", title: "Launch & ASO", description: "App Store submission, App Store Optimization, and post-launch monitoring.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Mobile Framework",
        technologies: [
          { name: "React Native", icon: Smartphone }, { name: "Expo", icon: Smartphone }, { name: "TypeScript", icon: Code }, { name: "Redux Toolkit", icon: Layers },
        ],
      },
      {
        category: "Backend & Services",
        technologies: [
          { name: "Node.js API", icon: Server }, { name: "Firebase", icon: Database }, { name: "Push Notifications", icon: MessageSquare }, { name: "Stripe Payments", icon: DollarSign },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "On-Demand Home Services App",
        client: "FixItFast",
        challenge: "Needed an Uber-like app connecting homeowners with service providers on iOS and Android.",
        solution: "Built a React Native marketplace app with real-time booking, GPS tracking, in-app payments, and push notifications.",
        results: [
          { label: "App Downloads", value: "25,000+" },
          { label: "Booking Conversion", value: "38%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "React Native vs. native iOS/Android — which is better?", answer: "For 95% of apps, React Native delivers equivalent performance at a fraction of the cost. We recommend full native only for apps that require extreme rendering performance, like AAA mobile games." },
      { id: "faq2", question: "How long does app development take?", answer: "A focused MVP app typically takes 10–16 weeks. More feature-rich apps can take 4–8 months depending on complexity and the number of third-party integrations." },
    ],
    ctaHeadline: "Launch Your App on iOS & Android",
    ctaDescription: "Let's transform your idea into a mobile app that users can't put down.",
  },

  /* ─────────────────────── 7. WEB APPLICATION DEVELOPMENT ─────────────────────── */
  "web-application-development": {
    id: "web-application-development",
    title: "Web Application Development",
    badge: "Browser-Native Platforms",
    heroHeadline: "Powerful Web Apps That Drive Real Business Value",
    heroDescription:
      "We build complex, feature-rich web applications — from internal tools and portals to customer-facing platforms — with performance, security, and scalability as first-class concerns.",
    seo: {
      title: "Web Application Development Services | Aformix",
      description: "Aformix develops high-performance web applications for businesses. Custom portals, dashboards, platforms, and more — built with modern frameworks.",
      keywords: "Web Application Development, Web App, Custom Portal, Dashboard Development, SaaS Platform, PWA",
    },
    problems: [
      { id: "p1", title: "Outdated Internal Tools", description: "Your team is using spreadsheets and manual processes where a web app could automate and centralize everything.", icon: Monitor },
      { id: "p2", title: "Poor User Experience", description: "Clunky, slow web apps are killing productivity and frustrating your customers and employees alike.", icon: ThumbsUp },
      { id: "p3", title: "Security Vulnerabilities", description: "Web apps are top targets for breaches. Poorly built applications expose your business to serious risk.", icon: ShieldCheck },
    ],
    solution: {
      title: "Web Apps Built for the Real World",
      description: "We build production-grade web applications with a relentless focus on performance, security, and UX. Our apps are built to handle real traffic, real data, and real business complexity.",
      benefits: ["Progressive Web App (PWA) capabilities", "Role-based access control", "Real-time data with WebSockets", "Enterprise-grade security"],
    },
    features: [
      { id: "f1", title: "Dashboard & Analytics", description: "Real-time data visualization dashboards giving you immediate business intelligence.", icon: BarChart },
      { id: "f2", title: "User Management", description: "Complete auth systems with SSO, MFA, and granular permission management.", icon: Users },
      { id: "f3", title: "Third-Party Integrations", description: "Connect your web app to CRMs, payment gateways, ERPs, and more.", icon: PlugZap },
      { id: "f4", title: "Progressive Web App", description: "Installable, offline-capable web apps that feel like native mobile applications.", icon: Smartphone },
    ],
    benefits: [
      { id: "b1", title: "Productivity Boost", description: "Internal tools that save each employee hours per week compound massively.", metric: "30%", metricLabel: "Productivity Gain" },
      { id: "b2", title: "Reduced Errors", description: "Replace error-prone spreadsheets with validated, automated web workflows.", metric: "95%", metricLabel: "Error Reduction" },
      { id: "b3", title: "Always Accessible", description: "Browser-based means no installation, no updates — just log in from anywhere.", metric: "100%", metricLabel: "Cross-Platform" },
    ],
    process: [
      { id: "pr1", title: "Requirements Mapping", description: "Translating business requirements into detailed technical user stories.", icon: FileText },
      { id: "pr2", title: "UI/UX Prototyping", description: "Interactive prototypes reviewed and approved before development.", icon: PenTool },
      { id: "pr3", title: "Agile Development", description: "Bi-weekly sprints with continuous demos, feedback, and iteration.", icon: Code },
      { id: "pr4", title: "Deployment & Training", description: "Production release, staff training, and handover documentation.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Frontend",
        technologies: [
          { name: "React / Next.js", icon: Code }, { name: "TypeScript", icon: Code }, { name: "Tailwind CSS", icon: Layout },
        ],
      },
      {
        category: "Backend & Database",
        technologies: [
          { name: "Node.js", icon: Server }, { name: "PostgreSQL / MySQL", icon: Database }, { name: "Redis Cache", icon: Database }, { name: "AWS", icon: Server },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Insurance Policy Management Portal",
        client: "SecureGroup Insurance",
        challenge: "Agents were managing thousands of policies across 5 disconnected spreadsheets, causing daily errors.",
        solution: "Built a centralized web application with policy tracking, automated renewals, commission calculation, and client portal access.",
        results: [
          { label: "Admin Time Saved", value: "15hrs/wk" },
          { label: "Data Errors Eliminated", value: "98%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "What's the difference between a website and a web application?", answer: "A website primarily presents information. A web application is interactive — users log in, create data, manage workflows, and take actions that change the system's state. Think Gmail vs. a blog." },
      { id: "faq2", question: "Can you build internal tools for my company?", answer: "Absolutely. We specialize in internal tools that dramatically boost productivity — custom dashboards, admin panels, reporting tools, and CRM systems." },
    ],
    ctaHeadline: "Launch Your Digital Platform",
    ctaDescription: "Tell us about your web application vision, and we'll build it with enterprise-grade quality.",
  },

  /* ─────────────────────── 8. SEO SERVICES ─────────────────────── */
  "seo": {
    id: "seo",
    title: "SEO Services",
    badge: "Organic Growth Engine",
    heroHeadline: "Rank Higher. Get Found. Grow Faster.",
    heroDescription:
      "We engineer comprehensive SEO strategies that move you to the top of Google — and keep you there. Data-driven, technically sound, and built for sustainable long-term organic traffic.",
    seo: {
      title: "SEO Services | Aformix",
      description: "Aformix delivers data-driven SEO services including technical SEO, on-page optimization, link building, and local SEO to grow your organic traffic.",
      keywords: "SEO Services, Search Engine Optimization, Technical SEO, Local SEO, SEO Agency, Organic Traffic",
    },
    problems: [
      { id: "p1", title: "Invisible on Google", description: "Competitors are ranking for your most valuable keywords while your website sits on page 3 collecting dust.", icon: Search },
      { id: "p2", title: "Wasted Ad Spend", description: "You're paying for every single click while competitors get the same traffic for free via organic search.", icon: DollarSign },
      { id: "p3", title: "Technical Site Issues", description: "Slow load times, crawl errors, and indexing problems are silently preventing Google from ranking your content.", icon: Settings },
    ],
    solution: {
      title: "A Full-Funnel SEO Strategy",
      description: "We approach SEO as a complete growth system — fixing technical foundations, optimizing content for intent, and building authoritative backlinks that signal trust to Google.",
      benefits: ["Full technical SEO audit & remediation", "Keyword research & content strategy", "On-page optimization", "Authority link building"],
    },
    features: [
      { id: "f1", title: "Technical SEO", description: "Core Web Vitals, crawlability, schema markup, site speed, and indexation fixes.", icon: Settings },
      { id: "f2", title: "On-Page Optimization", description: "Title tags, meta descriptions, headers, content, and internal linking optimized for target keywords.", icon: FileText },
      { id: "f3", title: "Local SEO", description: "Google Business Profile optimization, local citations, and geo-targeted content.", icon: Target },
      { id: "f4", title: "Link Building", description: "Strategic acquisition of high-authority backlinks that boost your domain rating.", icon: Globe },
    ],
    benefits: [
      { id: "b1", title: "Free, Compounding Traffic", description: "Unlike PPC, organic traffic doesn't stop when you stop paying. It compounds over time.", metric: "0", metricLabel: "Cost Per Click" },
      { id: "b2", title: "Higher Trust", description: "Organic results get 10x more clicks than paid ads at the same position.", metric: "10x", metricLabel: "More Trust" },
      { id: "b3", title: "Sustainable Growth", description: "SEO builds a long-term asset — your visibility — that appreciates in value.", metric: "Long", metricLabel: "Term Asset" },
    ],
    process: [
      { id: "pr1", title: "SEO Audit", description: "Full technical, on-page, and off-page audit to identify critical gaps.", icon: Search },
      { id: "pr2", title: "Strategy", description: "Keyword targeting, content calendar, and link acquisition plan.", icon: Target },
      { id: "pr3", title: "Implementation", description: "Technical fixes, content optimization, and link outreach campaigns.", icon: Code },
      { id: "pr4", title: "Track & Iterate", description: "Monthly reporting and continuous strategy refinement based on ranking data.", icon: BarChart },
    ],
    techStack: [
      {
        category: "SEO Strategy",
        technologies: [
          { name: "Technical SEO", icon: Settings }, { name: "Local SEO", icon: Target }, { name: "On-Page SEO", icon: FileText }, { name: "Content Strategy", icon: PenTool },
        ],
      },
      {
        category: "Tools",
        technologies: [
          { name: "Google Search Console", icon: Search }, { name: "Ahrefs", icon: Globe }, { name: "SEMrush", icon: BarChart }, { name: "Screaming Frog", icon: Settings },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "350% Organic Traffic Growth",
        client: "LegalEase Platform",
        challenge: "B2B SaaS had a great product but zero organic presence — 100% reliant on paid ads.",
        solution: "12-month SEO program: technical cleanup, 60+ optimized articles, and strategic link building campaign.",
        results: [
          { label: "Organic Sessions", value: "+350%" },
          { label: "Keyword Rankings", value: "120 Top-10" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "How long does SEO take to show results?", answer: "You'll typically see measurable improvements in 3–4 months. Significant ranking changes for competitive keywords happen in 6–12 months. SEO is a long-term investment with compounding returns." },
      { id: "faq2", question: "Do you guarantee first-page rankings?", answer: "No reputable agency can guarantee specific rankings — Google's algorithm is too complex. What we guarantee is a rigorous, best-practice approach that has consistently delivered strong results for our clients." },
      { id: "faq3", question: "Do you work with e-commerce sites?", answer: "Yes. E-commerce SEO is one of our specialties — category page optimization, product schema, faceted navigation, and content strategy for high purchase-intent keywords." },
    ],
    ctaHeadline: "Dominate Your Niche on Google",
    ctaDescription: "Request a free SEO audit and we'll show you exactly why you're not ranking.",
  },

  /* ─────────────────────── 9. UI/UX DESIGN ─────────────────────── */
  "ui-ux-design": {
    id: "ui-ux-design",
    title: "UI/UX Design",
    badge: "User Experience Excellence",
    heroHeadline: "Design That Converts, Delights, and Retains",
    heroDescription:
      "Great software starts with great design. We craft stunning, user-centered interfaces grounded in research and best practices — making your digital product impossible to leave.",
    seo: {
      title: "UI/UX Design Services | Aformix",
      description: "Aformix delivers world-class UI/UX design services — from user research and wireframing to high-fidelity prototypes and design systems.",
      keywords: "UI UX Design, User Interface Design, User Experience, Product Design, Figma Design, Design System",
    },
    problems: [
      { id: "p1", title: "High Drop-Off Rates", description: "Users are leaving your app or website at critical points because the experience is confusing or frustrating.", icon: TrendingUp },
      { id: "p2", title: "Low Conversion Rates", description: "Your traffic doesn't convert. Poor UX is the #1 reason users don't take the actions you need them to take.", icon: Target },
      { id: "p3", title: "No Design Consistency", description: "Inconsistent UI patterns across your product create cognitive load and undermine user trust.", icon: Sliders },
    ],
    solution: {
      title: "Research-Driven Design That Performs",
      description: "We combine deep user research with world-class visual design craft. Every decision is justified by user data and conversion best practices — not personal preference.",
      benefits: ["User research & usability testing", "Information architecture", "High-fidelity Figma prototypes", "Scalable design system"],
    },
    features: [
      { id: "f1", title: "User Research", description: "Interviews, surveys, and usability tests to deeply understand your users' mental models.", icon: Users },
      { id: "f2", title: "Wireframing", description: "Low-fidelity wireframes that rapidly validate information architecture and user flows.", icon: Layout },
      { id: "f3", title: "High-Fidelity Prototypes", description: "Pixel-perfect, interactive Figma prototypes ready for development handoff.", icon: PenTool },
      { id: "f4", title: "Design System", description: "A comprehensive component library ensuring perfect consistency at scale.", icon: Layers },
    ],
    benefits: [
      { id: "b1", title: "Conversion Improvement", description: "Good UX directly increases the percentage of visitors who become customers.", metric: "+32%", metricLabel: "Avg. Conversion Lift" },
      { id: "b2", title: "Lower Dev Costs", description: "Well-designed specs prevent costly redesigns and development rework.", metric: "50%", metricLabel: "Less Rework" },
      { id: "b3", title: "User Retention", description: "Delightful experiences build habits — users keep coming back.", metric: "2.5x", metricLabel: "Better Retention" },
    ],
    process: [
      { id: "pr1", title: "Research & Discovery", description: "User interviews, competitor analysis, and heuristic evaluation.", icon: Search },
      { id: "pr2", title: "Information Architecture", description: "User flows, sitemaps, and content hierarchy that make sense.", icon: Layers },
      { id: "pr3", title: "Visual Design", description: "Brand-aligned UI crafted with typography, color, and motion in mind.", icon: PenTool },
      { id: "pr4", title: "Prototype & Test", description: "Interactive prototypes user-tested before any code is written.", icon: Eye },
    ],
    techStack: [
      {
        category: "Design Tools",
        technologies: [
          { name: "Figma", icon: PenTool }, { name: "Adobe XD", icon: PenTool }, { name: "FigJam", icon: Layout }, { name: "Framer", icon: Code },
        ],
      },
      {
        category: "Research & Testing",
        technologies: [
          { name: "Maze", icon: Target }, { name: "Hotjar", icon: Eye }, { name: "Lyssna", icon: Users }, { name: "Optimal Workshop", icon: Settings },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "SaaS Onboarding Redesign",
        client: "DataPulse Analytics",
        challenge: "72% of trial users dropped off before completing setup — product was powerful but confusing.",
        solution: "Complete UX audit and onboarding redesign using progressive disclosure and contextual guidance.",
        results: [
          { label: "Onboarding Completion", value: "+85%" },
          { label: "Trial-to-Paid Rate", value: "+41%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "What's the difference between UI and UX?", answer: "UX (User Experience) is about how a product works — the flow, the logic, the hierarchy. UI (User Interface) is how it looks — the colors, typography, and visual design. Great products need both working in harmony." },
      { id: "faq2", question: "Do you provide design handoff for developers?", answer: "Yes. We provide developer-ready Figma files with organized layers, design tokens, component specifications, and responsive states so your developers can implement the design pixel-perfectly." },
    ],
    ctaHeadline: "Transform Your User Experience",
    ctaDescription: "Let's design a product your users will rave about and your competitors will envy.",
  },

  /* ─────────────────────── 10. PORTFOLIO WEBSITES ─────────────────────── */
  "portfolio-websites": {
    id: "portfolio-websites",
    title: "Portfolio Websites",
    badge: "Professional Digital Presence",
    heroHeadline: "A Portfolio That Gets You Hired and Noticed",
    heroDescription:
      "Your portfolio is your most important sales tool. We build stunning, fast, and memorable portfolio websites that showcase your best work and convert visitors into clients or employers.",
    seo: {
      title: "Portfolio Website Design & Development | Aformix",
      description: "Aformix builds premium portfolio websites for designers, developers, photographers, and creative professionals that make a powerful first impression.",
      keywords: "Portfolio Website, Personal Website, Professional Portfolio, Portfolio Design, Creative Portfolio",
    },
    problems: [
      { id: "p1", title: "First Impressions Failing", description: "A poorly designed or generic portfolio immediately signals to clients and employers that you're not the premium option.", icon: Eye },
      { id: "p2", title: "Templates Look Generic", description: "Wix and Squarespace templates make your work blend in. Clients can't distinguish you from thousands of competitors.", icon: Layout },
      { id: "p3", title: "Not Ranking on Google", description: "Without proper SEO, your portfolio is invisible to potential clients searching for your services.", icon: Search },
    ],
    solution: {
      title: "Custom Portfolios Built to Impress",
      description: "We build fully custom, animated portfolio websites that immediately communicate your expertise and unique brand. Designed to be fast, memorable, and SEO-optimized.",
      benefits: ["100% custom — no templates", "Optimized for Core Web Vitals", "SEO-optimized from day one", "CMS for easy self-updating"],
    },
    features: [
      { id: "f1", title: "Custom Design", description: "A unique design that reflects your personal brand — not a recycled template.", icon: PenTool },
      { id: "f2", title: "Project Showcases", description: "Beautiful case study pages that tell the story behind your best work.", icon: Award },
      { id: "f3", title: "Animated Interactions", description: "Subtle, premium animations that make your portfolio feel modern and premium.", icon: Zap },
      { id: "f4", title: "CMS Integration", description: "Add or update projects yourself without touching code, via a simple CMS.", icon: Settings },
    ],
    benefits: [
      { id: "b1", title: "More Client Inquiries", description: "A premium portfolio directly translates to a higher quantity and quality of inbound leads.", metric: "3x", metricLabel: "More Inquiries" },
      { id: "b2", title: "Command Higher Rates", description: "Premium presentation justifies premium pricing for your services.", metric: "40%", metricLabel: "Higher Rates" },
      { id: "b3", title: "24/7 Sales Tool", description: "Your portfolio works for you around the clock — showcasing your work while you sleep.", metric: "24/7", metricLabel: "Working For You" },
    ],
    process: [
      { id: "pr1", title: "Brand Discovery", description: "Understanding your story, target audience, and the impression you want to make.", icon: Search },
      { id: "pr2", title: "Design Concept", description: "Unique visual concept aligned with your personal brand identity.", icon: PenTool },
      { id: "pr3", title: "Build & Animate", description: "Development with custom animations, CMS integration, and responsive design.", icon: Code },
      { id: "pr4", title: "Launch & Optimize", description: "SEO setup, analytics tracking, and performance optimization.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Technologies",
        technologies: [
          { name: "Next.js", icon: Code }, { name: "Framer Motion", icon: Zap }, { name: "Tailwind CSS", icon: Layout }, { name: "Sanity CMS", icon: Database },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Architecture Portfolio",
        client: "Arya Kapoor, Architect",
        challenge: "Award-winning architect losing clients to competitors with more professional-looking online portfolios.",
        solution: "Built a bespoke portfolio with immersive project showcases, 3D model embeds, and a filtered project gallery.",
        results: [
          { label: "Inbound Inquiries", value: "+180%" },
          { label: "Project Rate Increase", value: "+35%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Do I need a portfolio website if I'm on LinkedIn?", answer: "Yes. LinkedIn is for networking. A custom portfolio website is your personal brand — it lets you fully control your narrative, showcase work in depth, and collect inbound leads." },
      { id: "faq2", question: "Can I update my own portfolio without a developer?", answer: "Absolutely. We integrate a headless CMS (like Sanity or Contentful) so you can add new projects, update case studies, and edit content from a simple dashboard — no code needed." },
    ],
    ctaHeadline: "Get a Portfolio Worth Showing Off",
    ctaDescription: "Let's build a digital presence that lands you your dream clients.",
  },

  /* ─────────────────────── 11. HOSPITAL MANAGEMENT SYSTEMS ─────────────────────── */
  "hospital-management-systems": {
    id: "hospital-management-systems",
    title: "Hospital Management Systems",
    badge: "Healthcare Technology",
    heroHeadline: "Digital Infrastructure for Modern Healthcare",
    heroDescription:
      "We build comprehensive Hospital Management Systems that streamline patient care, optimize operations, and ensure regulatory compliance — enabling healthcare providers to focus on what matters most: patients.",
    seo: {
      title: "Hospital Management System Development | Aformix",
      description: "Custom Hospital Management Systems (HMS) by Aformix. Streamline patient registration, scheduling, billing, and medical records with HIPAA-compliant software.",
      keywords: "Hospital Management System, HMS Software, Healthcare Software, Patient Management, EMR System, HIPAA Compliant",
    },
    problems: [
      { id: "p1", title: "Fragmented Patient Records", description: "Patient data scattered across paper files, spreadsheets, and disconnected systems leads to errors and delays.", icon: ClipboardList },
      { id: "p2", title: "Inefficient Appointment Scheduling", description: "Manual scheduling causes overbooking, no-shows, and wasted clinical capacity worth thousands daily.", icon: Clock },
      { id: "p3", title: "Billing & Compliance Errors", description: "Manual billing processes lead to claim denials, revenue leakage, and regulatory compliance risks.", icon: DollarSign },
    ],
    solution: {
      title: "An Integrated Digital Backbone for Your Hospital",
      description: "Our HMS integrates patient management, scheduling, EMR, pharmacy, lab, billing, and reporting into a single, secure platform — eliminating data silos and administrative overhead.",
      benefits: ["Centralized Electronic Medical Records (EMR)", "Automated appointment & resource scheduling", "HIPAA-compliant data security", "Automated insurance billing & claims"],
    },
    features: [
      { id: "f1", title: "Patient Registration & EMR", description: "Digital patient records, medical history, prescriptions, and lab results in one unified profile.", icon: HeartPulse },
      { id: "f2", title: "Appointment Management", description: "Smart scheduling with automated reminders, waitlists, and multi-doctor coordination.", icon: Clock },
      { id: "f3", title: "Lab & Pharmacy Module", description: "Digital lab orders, results delivery, and integrated pharmacy dispensing.", icon: Stethoscope },
      { id: "f4", title: "Revenue Cycle Management", description: "Automated insurance verification, claims submission, and payment tracking.", icon: DollarSign },
    ],
    benefits: [
      { id: "b1", title: "Reduced Admin Time", description: "Automate repetitive administrative tasks, freeing staff for patient-facing work.", metric: "60%", metricLabel: "Less Admin Work" },
      { id: "b2", title: "Reduced Billing Errors", description: "Automated billing dramatically reduces claim denials and revenue leakage.", metric: "40%", metricLabel: "Fewer Errors" },
      { id: "b3", title: "Full Compliance", description: "Built with HIPAA security requirements embedded from the architecture level.", metric: "100%", metricLabel: "HIPAA Compliant" },
    ],
    process: [
      { id: "pr1", title: "Workflow Analysis", description: "Mapping existing clinical and administrative workflows to understand needs.", icon: Search },
      { id: "pr2", title: "HIPAA Architecture", description: "Designing a secure, encrypted data architecture compliant with healthcare regulations.", icon: ShieldCheck },
      { id: "pr3", title: "Module Development", description: "Building each HMS module (OPD, IPD, pharmacy, lab, billing) in sprints.", icon: Code },
      { id: "pr4", title: "Staff Training & Go-Live", description: "On-site staff training, data migration from legacy systems, and live support.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Application",
        technologies: [
          { name: "React / Next.js", icon: Code }, { name: "Node.js", icon: Server }, { name: "PostgreSQL", icon: Database }, { name: "HL7/FHIR APIs", icon: Activity },
        ],
      },
      {
        category: "Security & Compliance",
        technologies: [
          { name: "AES-256 Encryption", icon: ShieldCheck }, { name: "HIPAA Controls", icon: Lock }, { name: "AWS HIPAA-Eligible", icon: Server },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Multi-Branch Hospital Digitization",
        client: "CareFirst Medical Group",
        challenge: "5-branch hospital group running entirely on paper records, causing daily errors and delays in patient care.",
        solution: "Full HMS deployment covering patient management, OPD/IPD workflows, lab, pharmacy, and billing across all 5 branches.",
        results: [
          { label: "Paper Eliminated", value: "95%" },
          { label: "Patient Wait Time", value: "-45min" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Can the HMS integrate with our existing lab equipment?", answer: "Yes. We build HL7 and FHIR-compliant APIs that integrate with most major lab analyzers, imaging systems (PACS), and pharmacy dispensing systems." },
      { id: "faq2", question: "Is the system accessible on mobile for doctors?", answer: "Yes. Doctors can access patient records, view lab results, and write prescriptions from any device — tablet, phone, or desktop — via our responsive web interface." },
    ],
    ctaHeadline: "Modernize Your Healthcare Operations",
    ctaDescription: "Book a free needs assessment and discover how a custom HMS can transform patient care.",
  },

  /* ─────────────────────── 12. CRM DEVELOPMENT ─────────────────────── */
  "crm-development": {
    id: "crm-development",
    title: "CRM Development",
    badge: "Customer Relationship Management",
    heroHeadline: "A CRM That Works Exactly Like Your Business",
    heroDescription:
      "Generic CRMs force your sales process into their boxes. We build custom CRM systems tailored precisely to your sales pipeline, industry workflows, and customer management needs.",
    seo: {
      title: "Custom CRM Development | Aformix",
      description: "Aformix builds custom CRM systems that perfectly fit your sales process, customer management workflows, and business model — no costly per-seat SaaS fees.",
      keywords: "CRM Development, Custom CRM, Customer Relationship Management, Sales CRM, CRM Software",
    },
    problems: [
      { id: "p1", title: "Off-Shelf CRM Doesn't Fit", description: "Salesforce and HubSpot are built for the average business — not yours. Workarounds accumulate and slow your team down.", icon: Briefcase },
      { id: "p2", title: "Expensive Per-Seat Pricing", description: "CRM costs scale aggressively with your headcount. At 50+ users, annual fees become a significant burden.", icon: DollarSign },
      { id: "p3", title: "Poor Data Quality", description: "Without a CRM built for your process, sales data is incomplete, inaccurate, and useless for forecasting.", icon: Database },
    ],
    solution: {
      title: "A CRM That Mirrors Your Sales Reality",
      description: "We build custom CRM platforms designed around your specific sales stages, customer segments, and reporting needs — giving your team a tool they actually want to use.",
      benefits: ["Custom pipeline stages & deal flows", "Automated follow-up sequences", "Deep reporting & forecasting", "No per-seat licensing fees"],
    },
    features: [
      { id: "f1", title: "Visual Pipeline Management", description: "Kanban and list views with drag-and-drop deal management across custom stages.", icon: Sliders },
      { id: "f2", title: "Contact & Company Profiles", description: "Rich contact profiles with full interaction history, notes, and file attachments.", icon: Users },
      { id: "f3", title: "Follow-ups & Sequences", description: "Scheduled email follow-ups, task creation, and stage transitions based on deal triggers.", icon: Zap },
      { id: "f4", title: "Sales Analytics", description: "Real-time dashboards for pipeline velocity, win rate, rep performance, and revenue forecasting.", icon: BarChart },
    ],
    benefits: [
      { id: "b1", title: "Adoption Rate", description: "Sales teams love CRMs built for how they actually work — adoption skyrockets.", metric: "95%", metricLabel: "User Adoption" },
      { id: "b2", title: "Revenue Increase", description: "Companies with properly used CRMs see consistent revenue improvements.", metric: "+29%", metricLabel: "Revenue Growth" },
      { id: "b3", title: "No SaaS Fees", description: "Own your CRM outright and pay zero per-seat monthly fees, ever.", metric: "$0", metricLabel: "Per Seat / Month" },
    ],
    process: [
      { id: "pr1", title: "Sales Process Audit", description: "Mapping your current sales pipeline, stages, and common deal scenarios.", icon: Search },
      { id: "pr2", title: "CRM Architecture", description: "Designing entity relationships, custom fields, trigger rules, and reporting structure.", icon: Layers },
      { id: "pr3", title: "Build & Test", description: "Development with sales team involvement to validate each feature before release.", icon: Code },
      { id: "pr4", title: "Migration & Training", description: "Data migration from your existing CRM and hands-on training for every sales rep.", icon: Rocket },
    ],
    techStack: [
      {
        category: "Application Stack",
        technologies: [
          { name: "React", icon: Code }, { name: "Node.js", icon: Server }, { name: "PostgreSQL", icon: Database }, { name: "Redis", icon: Database },
        ],
      },
      {
        category: "Integrations",
        technologies: [
          { name: "Email APIs (SendGrid)", icon: MessageSquare }, { name: "Calendar Sync", icon: Clock }, { name: "LinkedIn API", icon: Share2 }, { name: "Stripe", icon: DollarSign },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Real Estate CRM Platform",
        client: "NestKey Realty",
        challenge: "500-agent realty firm using spreadsheets to manage leads, listings, and client follow-ups — massive revenue leakage from missed follow-ups.",
        solution: "Built a custom real estate CRM with automated lead routing, listing management, client portals, and smart follow-up sequences.",
        results: [
          { label: "Lead Response Time", value: "< 5min" },
          { label: "Deals Closed", value: "+22%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Should I build a custom CRM or use Salesforce?", answer: "If your process is standard and you have < 20 users, Salesforce might work. But if you have unique workflows, many users, or want to own your data — a custom CRM pays for itself within 18–24 months." },
      { id: "faq2", question: "Can you migrate our data from HubSpot or Salesforce?", answer: "Yes. We handle complete data migrations from any CRM, including contacts, deals, notes, attachments, and activity history." },
    ],
    ctaHeadline: "Build the CRM Your Sales Team Will Actually Use",
    ctaDescription: "Let's design a CRM that fits your process — not the other way around.",
  },

  /* ─────────────────────── 14. ERP SOLUTIONS ─────────────────────── */
  "erp-solutions": {
    id: "erp-solutions",
    title: "ERP Solutions",
    badge: "Enterprise Resource Planning",
    heroHeadline: "Unify Your Entire Business in One Intelligent System",
    heroDescription:
      "We build and implement custom ERP solutions that connect your finance, inventory, HR, sales, and operations — giving leadership a single source of truth for every business decision.",
    seo: {
      title: "Custom ERP Development | Aformix",
      description: "Aformix builds custom ERP systems that unify operations, finance, inventory, HR, and sales into one integrated platform for complete business visibility.",
      keywords: "ERP Development, Custom ERP, Enterprise Resource Planning, ERP Software, Business Management System",
    },
    problems: [
      { id: "p1", title: "Data Scattered Everywhere", description: "Finance uses QuickBooks, ops uses spreadsheets, and sales uses a CRM — none of them talk to each other.", icon: Database },
      { id: "p2", title: "No Real-Time Visibility", description: "Leadership can't see accurate inventory, cash flow, or project status without manually assembling reports.", icon: Eye },
      { id: "p3", title: "Process Inconsistency", description: "Different departments following different processes creates errors, delays, and unhappy customers.", icon: RefreshCw },
    ],
    solution: {
      title: "One System. Every Department. Real-Time.",
      description: "Our custom ERP systems integrate all departments into a single platform — providing real-time visibility across operations, finance, HR, and supply chain with automated workflows throughout.",
      benefits: ["Unified data across all departments", "Real-time KPI dashboards", "Automated inter-department workflows", "Role-based access by department"],
    },
    features: [
      { id: "f1", title: "Financial Management", description: "General ledger, accounts payable/receivable, budgeting, and financial reporting.", icon: DollarSign },
      { id: "f2", title: "Inventory & Supply Chain", description: "Real-time inventory tracking, purchase orders, supplier management, and warehouse operations.", icon: Package },
      { id: "f3", title: "HR & Payroll", description: "Employee management, payroll processing, leave management, and performance tracking.", icon: Users },
      { id: "f4", title: "Executive Dashboard", description: "C-level dashboard with real-time KPIs across all business functions.", icon: BarChart },
    ],
    benefits: [
      { id: "b1", title: "Operational Efficiency", description: "Eliminate inter-department manual handoffs and streamline core business processes.", metric: "35%", metricLabel: "Efficiency Gain" },
      { id: "b2", title: "Faster Decisions", description: "Real-time data across the business enables leadership to make faster, informed decisions.", metric: "Real", metricLabel: "Time Data" },
      { id: "b3", title: "Cost Consolidation", description: "Replace multiple SaaS subscriptions with a single owned system.", metric: "Significant", metricLabel: "Cost Savings" },
    ],
    process: [
      { id: "pr1", title: "Business Process Analysis", description: "Deep analysis of all departments to map data flows and integration points.", icon: Search },
      { id: "pr2", title: "ERP Architecture", description: "Designing the unified data model, module structure, and integration architecture.", icon: Layers },
      { id: "pr3", title: "Phased Development", description: "Building modules in priority order with each phase delivering immediate value.", icon: Code },
      { id: "pr4", title: "Migration & Go-Live", description: "Full data migration, user training, and phased go-live to minimize disruption.", icon: Rocket },
    ],
    techStack: [
      {
        category: "ERP Platform",
        technologies: [
          { name: "React / Next.js", icon: Code }, { name: "Node.js", icon: Server }, { name: "PostgreSQL", icon: Database }, { name: "Redis", icon: Database },
        ],
      },
      {
        category: "Key Integrations",
        technologies: [
          { name: "Payment Gateways", icon: DollarSign }, { name: "Banking APIs", icon: BarChart }, { name: "Shipping APIs", icon: Package }, { name: "DocuSign", icon: FileText },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Manufacturing ERP Implementation",
        client: "PrimeCast Industries",
        challenge: "Manufacturing firm with 200 employees running production, inventory, HR, and finance on disconnected systems and spreadsheets.",
        solution: "Built a unified ERP covering production planning, inventory, procurement, HR, and financial reporting with real-time dashboards.",
        results: [
          { label: "Inventory Accuracy", value: "99.5%" },
          { label: "Reporting Time", value: "-80%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Custom ERP vs. SAP / Oracle?", answer: "Enterprise ERPs like SAP cost millions in licensing and implementation, and require years of customization to fit your business. A custom ERP is built around your exact processes from day one at a fraction of the cost." },
      { id: "faq2", question: "How disruptive is an ERP implementation?", answer: "We use a phased implementation approach — rolling out one module at a time — so your operations continue normally throughout the implementation. We've never caused a business disruption." },
    ],
    ctaHeadline: "Unify Your Business with a Custom ERP",
    ctaDescription: "Let's map your operations and design an ERP that gives you complete business visibility.",
  },

  /* ─────────────────────── 15. E-COMMERCE ─────────────────────── */
  "e-commerce-development": {
    id: "e-commerce-development",
    title: "E-Commerce Development",
    badge: "Online Store Development",
    heroHeadline: "E-Commerce Stores Built to Convert and Scale",
    heroDescription:
      "We build high-performance e-commerce platforms that turn visitors into buyers — with blazing-fast load times, seamless checkout flows, and conversion-optimized designs.",
    seo: {
      title: "E-Commerce Development Services | Aformix",
      description: "Aformix builds custom e-commerce stores and Shopify solutions that maximize conversions, handle high traffic, and scale with your business.",
      keywords: "E-Commerce Development, Shopify Development, Custom E-Commerce, Online Store, E-Commerce Website",
    },
    problems: [
      { id: "p1", title: "High Cart Abandonment", description: "70%+ of shoppers abandon carts — usually due to slow sites, friction in checkout, or lack of trust signals.", icon: ShoppingCart },
      { id: "p2", title: "Poor Mobile Experience", description: "Over 60% of e-commerce traffic is mobile, but most stores perform terribly on phones.", icon: Smartphone },
      { id: "p3", title: "Platform Limitations", description: "Your current platform can't handle your product catalog size, customization needs, or traffic volumes.", icon: Settings },
    ],
    solution: {
      title: "Conversion-Engineered E-Commerce Experiences",
      description: "We build e-commerce stores where every pixel and interaction is designed to reduce friction and increase purchase rates — from landing page through checkout confirmation.",
      benefits: ["Conversion-optimized checkout flow", "Mobile-first design", "Sub-2-second page loads", "Advanced product filtering & search"],
    },
    features: [
      { id: "f1", title: "Custom Product Pages", description: "Rich, conversion-optimized product pages with zoom, 360-views, and social proof.", icon: ShoppingCart },
      { id: "f2", title: "Smart Search & Filters", description: "Instant search with typo tolerance and faceted filtering to help users find products fast.", icon: Search },
      { id: "f3", title: "Abandoned Cart Recovery", description: "Automated email sequences recovering 15–25% of abandoned carts.", icon: MessageSquare },
      { id: "f4", title: "Analytics Dashboard", description: "Revenue, conversion rate, AOV, and customer LTV tracking in one dashboard.", icon: BarChart },
    ],
    benefits: [
      { id: "b1", title: "Conversion Rate", description: "Optimized checkout flows and page performance significantly increase purchase rates.", metric: "+25%", metricLabel: "Conversion Rate" },
      { id: "b2", title: "Faster Load Times", description: "Every 1-second improvement in load time increases conversions by 7%.", metric: "< 2s", metricLabel: "Load Time" },
      { id: "b3", title: "Cart Recovery", description: "Automated abandoned cart recovery brings back lost revenue 24/7.", metric: "20%", metricLabel: "Cart Recovery" },
    ],
    process: [
      { id: "pr1", title: "Conversion Audit", description: "Analyzing your current funnel to identify the biggest conversion bottlenecks.", icon: Search },
      { id: "pr2", title: "UX & Design", description: "Customer journey mapping and UI design optimized for purchase decisions.", icon: PenTool },
      { id: "pr3", title: "Development", description: "Building the store with performance as a primary KPI alongside functionality.", icon: Code },
      { id: "pr4", title: "Launch & Optimize", description: "A/B testing, analytics setup, and ongoing CRO after launch.", icon: Target },
    ],
    techStack: [
      {
        category: "Platforms",
        technologies: [
          { name: "Shopify / Shopify Plus", icon: ShoppingCart }, { name: "Next.js Custom", icon: Code }, { name: "WooCommerce", icon: ShoppingCart },
        ],
      },
      {
        category: "Commerce Stack",
        technologies: [
          { name: "Stripe Payments", icon: DollarSign }, { name: "Algolia Search", icon: Search }, { name: "Klaviyo Email", icon: MessageSquare }, { name: "Sanity CMS", icon: Database },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Fashion Brand E-Commerce Launch",
        client: "LUMÉ Apparel",
        challenge: "Fashion brand launching online with a WooCommerce store that was slow, ugly, and difficult to manage.",
        solution: "Rebuilt on Shopify Plus with a custom theme, augmented reality try-on feature, and loyalty program integration.",
        results: [
          { label: "First Month Revenue", value: "$85K" },
          { label: "Conversion Rate", value: "4.2%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Shopify vs. custom e-commerce — which should I choose?", answer: "Shopify is excellent for most standard e-commerce use cases and launches fastest. Custom development makes sense when you have unique business logic, need complex integrations, or want full ownership." },
      { id: "faq2", question: "Can you handle high-traffic events like Black Friday?", answer: "Yes. We load-test all e-commerce builds before launch and configure auto-scaling cloud infrastructure to handle 10x normal traffic spikes without performance degradation." },
    ],
    ctaHeadline: "Launch Your High-Converting Online Store",
    ctaDescription: "Let's build an e-commerce experience that turns browsers into buyers.",
  },

  /* ─────────────────────── 16. WORDPRESS DEVELOPMENT ─────────────────────── */
  "wordpress-development": {
    id: "wordpress-development",
    title: "WordPress Development",
    badge: "World's Most Popular CMS",
    heroHeadline: "WordPress Sites That Are Fast, Secure, and Beautiful",
    heroDescription:
      "We build premium custom WordPress websites — from corporate sites and blogs to complex membership platforms and WooCommerce stores — that are fast, secure, and easy for you to manage.",
    seo: {
      title: "WordPress Development Services | Aformix",
      description: "Expert WordPress development by Aformix. Custom themes, plugins, WooCommerce stores, and high-performance WordPress solutions.",
      keywords: "WordPress Development, Custom WordPress, WordPress Theme, WordPress Plugin, WooCommerce, WordPress Agency",
    },
    problems: [
      { id: "p1", title: "Slow WordPress Site", description: "Bloated themes, unoptimized plugins, and no caching make your WordPress site embarrassingly slow.", icon: Clock },
      { id: "p2", title: "Security Vulnerabilities", description: "Outdated plugins and weak configurations make WordPress sites prime targets for hackers and malware.", icon: ShieldCheck },
      { id: "p3", title: "Can't Customize Enough", description: "Your current theme limits what you can build. Customizations require developer intervention for every small change.", icon: Settings },
    ],
    solution: {
      title: "WordPress Done the Right Way",
      description: "We build lean, custom WordPress solutions — using only what's needed, nothing more. Fast performance, enterprise security, and intuitive Gutenberg editing that empowers your team.",
      benefits: ["Custom block themes — no page builder bloat", "90+ Lighthouse performance score", "Hardened security configuration", "Intuitive content management for your team"],
    },
    features: [
      { id: "f1", title: "Custom Theme Development", description: "Pixel-perfect custom themes built from scratch — no bloated page builders.", icon: PenTool },
      { id: "f2", title: "Custom Plugin Development", description: "Bespoke plugins for functionality that doesn't exist in the plugin ecosystem.", icon: Code },
      { id: "f3", title: "WooCommerce Development", description: "Custom WooCommerce storefronts with unique checkout flows and product pages.", icon: ShoppingCart },
      { id: "f4", title: "Performance Optimization", description: "Server-level caching, image optimization, CDN, and Core Web Vitals tuning.", icon: Zap },
    ],
    benefits: [
      { id: "b1", title: "Performance Score", description: "Our WordPress builds score 90+ on Google Lighthouse for Core Web Vitals.", metric: "90+", metricLabel: "Lighthouse Score" },
      { id: "b2", title: "Easy to Manage", description: "Your team can update content, add pages, and manage media without any technical knowledge.", metric: "Zero", metricLabel: "Dev Dependency" },
      { id: "b3", title: "Security Hardened", description: "We implement 20+ security measures to protect your WordPress installation.", metric: "99%", metricLabel: "Uptime SLA" },
    ],
    process: [
      { id: "pr1", title: "Discovery & Design", description: "Content strategy, sitemap, and UI design before any development begins.", icon: PenTool },
      { id: "pr2", title: "Custom Development", description: "Building a lightweight custom theme using modern WordPress block editor APIs.", icon: Code },
      { id: "pr3", title: "Security & Performance", description: "Security hardening, caching setup, CDN configuration, and Core Web Vitals optimization.", icon: ShieldCheck },
      { id: "pr4", title: "Training & Handover", description: "Screen-recorded training so your team can manage the site confidently.", icon: Rocket },
    ],
    techStack: [
      {
        category: "WordPress Stack",
        technologies: [
          { name: "WordPress (Latest)", icon: Globe }, { name: "PHP 8.x", icon: Code }, { name: "Custom Block Editor", icon: Layout }, { name: "WooCommerce", icon: ShoppingCart },
        ],
      },
      {
        category: "Performance & Security",
        technologies: [
          { name: "Cloudflare CDN", icon: Globe }, { name: "Redis Object Cache", icon: Database }, { name: "Wordfence Security", icon: ShieldCheck }, { name: "Kinsta / WP Engine", icon: Server },
        ],
      },
    ],
    caseStudies: [
      {
        id: "cs1",
        title: "Law Firm Website Redesign",
        client: "Morrison & Clarke Attorneys",
        challenge: "Old WordPress site was slow (8s load time), not mobile-friendly, and not generating any leads.",
        solution: "Custom WordPress theme rebuild with conversion-focused design, 99/100 PageSpeed score, and live chat integration.",
        results: [
          { label: "Page Load Time", value: "0.8s" },
          { label: "Inbound Leads", value: "+210%" },
        ],
      },
    ],
    faqs: [
      { id: "faq1", question: "Do you use Elementor or Divi page builders?", answer: "For premium builds, no. Page builders add significant code bloat that kills performance. We build custom block editor themes that are lean, fast, and future-proof with native WordPress APIs." },
      { id: "faq2", question: "Will I be able to update the site myself?", answer: "Absolutely. We build with the native WordPress Gutenberg editor, making it straightforward for non-technical users to add pages, update content, and manage media with confidence." },
      { id: "faq3", question: "Do you offer WordPress maintenance plans?", answer: "Yes. We offer monthly maintenance plans covering core, theme and plugin updates, security monitoring, weekly backups, and uptime monitoring." },
    ],
    ctaHeadline: "Build a WordPress Site Worth Showing Off",
    ctaDescription: "Let's create a fast, beautiful WordPress site that actually drives business results.",
  },
};
