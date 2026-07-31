import {
  Code2, Smartphone, Monitor,
  Search, Shield, Zap, Database, BarChart, 
  Settings, PenTool, LayoutTemplate, Layers,
  Server, MessageSquare, Headphones, Award
} from "lucide-react";

export type FeatureType = {
  icon: any;
  title: string;
  description: string;
};

export type BonusType = {
  title: string;
  value: string;
};

export type TimelineType = {
  phase: string;
  duration: string;
};

export type ProcessType = {
  step: number;
  title: string;
  description: string;
};

export type FAQType = {
  question: string;
  answer: string;
};

export type PackageType = {
  id: string;
  title: string;
  shortDescription: string;
  startingPrice: string;
  monthlyOption?: string;
  oneTimeOption: string;
  popularBadge: boolean;
  deliveryTime: string;
  discountPercentage?: string;
  limitedTimeOffer?: string;
  paymentTerms: string;
  moneyBackGuarantee: boolean;
  features: FeatureType[];
  bonusOffers: BonusType[];
  timeline: TimelineType[];
  process: ProcessType[];
  techStack: string[];
  idealClients: string[];
  faqs: FAQType[];
};

export const pricingData: Record<string, PackageType> = {
  starter: {
    id: "starter",
    title: "Starter",
    shortDescription: "Perfect for freelancers and small startups launching their first product.",
    startingPrice: "$499",
    oneTimeOption: "$499 One-Time",
    monthlyOption: "$50/mo (12 months)",
    popularBadge: false,
    deliveryTime: "2-4 Weeks",
    paymentTerms: "50% upfront, 50% upon completion",
    moneyBackGuarantee: true,
    features: [
      { icon: LayoutTemplate, title: "Custom Design", description: "Tailored landing page designed specifically for your brand identity." },
      { icon: Smartphone, title: "Mobile Responsive", description: "Flawless experience across all devices and screen sizes." },
      { icon: Search, title: "SEO Optimized", description: "Basic on-page SEO setup to help you rank on search engines." },
      { icon: Zap, title: "Fast Performance", description: "Optimized assets and code for blazing fast load times." },
      { icon: Code2, title: "Clean Codebase", description: "Built with modern standards for easy future upgrades." },
      { icon: MessageSquare, title: "2 Revision Rounds", description: "We refine the design until it matches your vision perfectly." }
    ],
    bonusOffers: [
      { title: "FREE Logo Design", value: "$150" },
      { title: "FREE Hosting Setup", value: "$100" },
      { title: "FREE SSL Certificate", value: "$50" }
    ],
    timeline: [
      { phase: "Discovery", duration: "2 Days" },
      { phase: "Design", duration: "1 Week" },
      { phase: "Development", duration: "1-2 Weeks" },
      { phase: "Launch", duration: "2 Days" }
    ],
    process: [
      { step: 1, title: "Requirement Gathering", description: "We discuss your goals, target audience, and design preferences." },
      { step: 2, title: "Design Approval", description: "We present a mockup of the landing page for your review." },
      { step: 3, title: "Development", description: "We build the approved design using modern web technologies." },
      { step: 4, title: "QA Testing", description: "Thorough testing on various devices and browsers." },
      { step: 5, title: "Deployment", description: "We launch your new website to the world." }
    ],
    techStack: ["React", "Tailwind CSS", "Vite", "Framer Motion", "Netlify"],
    idealClients: ["Startups", "Freelancers", "Personal Brands", "Local Businesses"],
    faqs: [
      { question: "How long does development take?", answer: "For the Starter package, it typically takes 2 to 4 weeks depending on how quickly feedback is provided during the design phase." },
      { question: "Do you provide hosting?", answer: "We provide free hosting setup assistance. We can recommend top-tier hosting providers and configure everything for you." },
      { question: "Can I request revisions?", answer: "Yes, the Starter package includes 2 dedicated rounds of revisions to ensure you are happy with the final product." },
      { question: "Do you provide the source code?", answer: "Absolutely. Upon final payment, you receive full ownership and access to the complete source code." },
      { question: "What do I need to provide before starting?", answer: "We'll need your brand assets (logo, colors), copy/text for the website, and any specific images you want to use." },
      { question: "Is the website SEO friendly?", answer: "Yes, we implement basic on-page SEO including meta tags, proper heading structures, and fast load times." },
      { question: "Can I upgrade to a bigger package later?", answer: "Yes! Since we build with scalable technologies, you can easily add more pages or features later." },
      { question: "Do you offer support after launch?", answer: "We offer 14 days of bug-fixing support post-launch. Ongoing maintenance plans are also available." },
      { question: "Are there any hidden fees?", answer: "No hidden fees. The price quoted is what you pay, assuming the scope of work doesn't change." },
      { question: "Will my website look good on mobile?", answer: "Yes, all our websites are 100% mobile responsive and tested across multiple device sizes." }
    ]
  },
  growth: {
    id: "growth",
    title: "Growth",
    shortDescription: "Ideal for growing teams that need reliable product design and scalable builds.",
    startingPrice: "$1,299",
    oneTimeOption: "$1,299 One-Time",
    monthlyOption: "$120/mo (12 months)",
    discountPercentage: "15% OFF",
    popularBadge: true,
    limitedTimeOffer: "Valid until end of month",
    deliveryTime: "4-8 Weeks",
    paymentTerms: "40% upfront, 30% milestone, 30% completion",
    moneyBackGuarantee: true,
    features: [
      { icon: LayoutTemplate, title: "Custom UI/UX", description: "Bespoke design system tailored to your specific user journey." },
      { icon: Layers, title: "Full-Stack Setup", description: "Frontend and Backend integration with database setup." },
      { icon: Database, title: "CMS Integration", description: "Easily manage your content without touching code." },
      { icon: Shield, title: "Security Setup", description: "Advanced security protocols to protect user data." },
      { icon: BarChart, title: "Analytics Integration", description: "Track user behavior with Google Analytics or custom tools." },
      { icon: Settings, title: "Admin Dashboard", description: "Custom dashboard to manage users, content, and settings." },
      { icon: PenTool, title: "Content Upload", description: "We help upload and format your initial batch of content." },
      { icon: Headphones, title: "3 Months Support", description: "Priority support and maintenance for 3 months post-launch." }
    ],
    bonusOffers: [
      { title: "FREE SEO Audit", value: "$300" },
      { title: "FREE Website Training", value: "$200" },
      { title: "FREE Social Media Graphics", value: "$150" }
    ],
    timeline: [
      { phase: "Discovery & Strategy", duration: "1 Week" },
      { phase: "UI/UX Design", duration: "2 Weeks" },
      { phase: "Development", duration: "3-4 Weeks" },
      { phase: "Testing & QA", duration: "1 Week" },
      { phase: "Launch & Training", duration: "3 Days" }
    ],
    process: [
      { step: 1, title: "Requirement & Strategy", description: "Deep dive into your business logic and user needs." },
      { step: 2, title: "Wireframing & UI", description: "Creating the visual blueprint and high-fidelity designs." },
      { step: 3, title: "Development", description: "Frontend and Backend development working in parallel." },
      { step: 4, title: "Integration", description: "Connecting CMS, analytics, and third-party tools." },
      { step: 5, title: "QA Testing", description: "Rigorous testing for security, performance, and usability." },
      { step: 6, title: "Deployment & Handover", description: "Going live and training your team on the new system." }
    ],
    techStack: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Framer Motion", "Vercel"],
    idealClients: ["Agencies", "SaaS Companies", "E-Commerce Stores", "Healthcare", "Education"],
    faqs: [
      { question: "How long does development take?", answer: "The Growth package typically takes 4 to 8 weeks depending on the complexity of the CMS and features required." },
      { question: "Do you provide hosting?", answer: "We assist with setting up scalable cloud hosting solutions like Vercel or AWS, optimized for Next.js and Node.js." },
      { question: "Can I request revisions?", answer: "Yes, you get unlimited revisions during the design phase, and up to 3 minor revision rounds during development." },
      { question: "Do you provide source code?", answer: "Yes, you have full ownership of the codebase and intellectual property upon final payment." },
      { question: "Do you offer support?", answer: "This package includes 3 months of priority support for bug fixes, minor updates, and technical assistance." },
      { question: "Can I manage the content myself?", answer: "Absolutely. We integrate a modern CMS (like Sanity, Strapi, or custom admin) so you can easily update text and images." },
      { question: "Is it optimized for SEO?", answer: "Yes, Next.js provides excellent Server-Side Rendering (SSR) which drastically improves technical SEO." },
      { question: "Do you handle payment gateways?", answer: "Yes, we can integrate Stripe, PayPal, or other regional gateways if your application requires transactions." },
      { question: "How do we communicate during the project?", answer: "We set up a dedicated Slack/Discord channel and have weekly check-in calls to review progress." },
      { question: "What kind of analytics do you set up?", answer: "We typically integrate Google Analytics 4, but can also set up Mixpanel or PostHog for deeper product analytics." }
    ]
  },
  enterprise: {
    id: "enterprise",
    title: "Enterprise",
    shortDescription: "Advanced solutions for enterprise-level systems with ongoing support.",
    startingPrice: "$2,499",
    oneTimeOption: "Custom Pricing",
    monthlyOption: "Retainer Available",
    popularBadge: false,
    deliveryTime: "8-12+ Weeks",
    paymentTerms: "Milestone based payments",
    moneyBackGuarantee: true,
    features: [
      { icon: Server, title: "Platform Architecture", description: "Scalable microservices or robust monolith architecture." },
      { icon: Zap, title: "API Integrations", description: "Seamless connection with third-party enterprise tools (ERP, CRM)." },
      { icon: Shield, title: "Security & Compliance", description: "GDPR compliance, data encryption, and advanced security." },
      { icon: Award, title: "Dedicated Manager", description: "A dedicated project manager ensuring smooth delivery." },
      { icon: Code2, title: "Custom Algorithms", description: "Complex business logic and custom API integrations." },
      { icon: Monitor, title: "Multi-Platform", description: "Web, Desktop, and Mobile readiness." },
      { icon: Database, title: "Data Migration", description: "Securely move your existing data to the new system." },
      { icon: Headphones, title: "24/7 SLA Support", description: "Enterprise-grade Service Level Agreement for continuous uptime." }
    ],
    bonusOffers: [
      { title: "FREE 1 Year Maintenance", value: "$2,400" },
      { title: "FREE Architecture Consultation", value: "$1,000" },
      { title: "FREE Dedicated Server Setup", value: "$500" }
    ],
    timeline: [
      { phase: "Comprehensive Discovery", duration: "2-3 Weeks" },
      { phase: "Architecture & Design", duration: "3-4 Weeks" },
      { phase: "Agile Development Sprints", duration: "Ongoing" },
      { phase: "Extensive QA & Security Audit", duration: "2 Weeks" },
      { phase: "Phased Rollout", duration: "1-2 Weeks" }
    ],
    process: [
      { step: 1, title: "Deep Discovery", description: "Understanding complex workflows, legacy systems, and compliance needs." },
      { step: 2, title: "Architecture Planning", description: "Designing database schemas, API contracts, and infrastructure." },
      { step: 3, title: "Agile Development", description: "Building features in bi-weekly sprints with continuous feedback." },
      { step: 4, title: "Security & Load Testing", description: "Ensuring the system can handle high traffic and resist attacks." },
      { step: 5, title: "Data Migration", description: "Carefully transferring data from old systems with zero loss." },
      { step: 6, title: "Phased Deployment", description: "Rolling out the system incrementally to minimize business disruption." },
      { step: 7, title: "Ongoing Support", description: "24/7 monitoring, scaling, and feature additions." }
    ],
    techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker", "Redis", "Tailwind CSS"],
    idealClients: ["Enterprise", "Healthcare Networks", "Financial Institutions", "Large E-Commerce", "Government"],
    faqs: [
      { question: "How long does development take?", answer: "Enterprise projects are highly custom. An MVP usually takes 8-12 weeks, followed by continuous agile development." },
      { question: "Do you provide hosting?", answer: "We architect and deploy on enterprise cloud providers like AWS, GCP, or Azure, setting up load balancers and auto-scaling." },
      { question: "Can I request revisions?", answer: "Since we work in Agile sprints, revisions and pivots are built into the process. You review work every two weeks." },
      { question: "Do you provide source code?", answer: "Yes. All IP and source code belong to your organization." },
      { question: "Do you offer support?", answer: "We offer tailored SLAs (Service Level Agreements) that can include 24/7 monitoring and guaranteed response times." },
      { question: "Can you integrate with our existing legacy systems?", answer: "Yes, we specialize in building custom APIs and middleware to connect modern web apps with legacy ERPs or CRMs." },
      { question: "How do you handle data security and compliance?", answer: "We follow industry best practices for encryption (at rest and in transit), role-based access control, and GDPR/HIPAA compliance if needed." },
      { question: "Who will manage the project?", answer: "A dedicated Technical Project Manager will be assigned to your account as your primary point of contact." },
      { question: "Can you build complex custom features?", answer: "Yes, we build advanced custom functionality including complex business logic, third-party integrations, and scalable backend systems." },
      { question: "How do you handle QA?", answer: "We employ comprehensive automated testing (unit, integration, e2e) alongside manual QA and third-party security audits." }
    ]
  },
  "saas-mvp": {
    id: "saas-mvp",
    title: "SaaS MVP",
    shortDescription: "Get your SaaS idea to market in 8 weeks with core features, auth, and billing.",
    startingPrice: "$9,999",
    oneTimeOption: "$9,999 One-Time",
    monthlyOption: "$1,500/mo (8 months)",
    popularBadge: false,
    deliveryTime: "8-10 Weeks",
    paymentTerms: "Milestones",
    moneyBackGuarantee: true,
    features: [
      { icon: Layers, title: "Multi-Tenant Architecture", description: "Secure data isolation for each customer." },
      { icon: Zap, title: "Stripe Billing Integration", description: "Flexible subscriptions, trials, and invoices." },
      { icon: Shield, title: "Auth & User Management", description: "Role-based access control and onboarding." }
    ],
    bonusOffers: [],
    timeline: [],
    process: [],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    idealClients: ["Founders", "Startups"],
    faqs: []
  },
  "saas-scale": {
    id: "saas-scale",
    title: "SaaS Scale",
    shortDescription: "For growing SaaS platforms needing performance, analytics, and integrations.",
    startingPrice: "$24,999",
    oneTimeOption: "$24,999 One-Time",
    popularBadge: true,
    deliveryTime: "12-16 Weeks",
    paymentTerms: "Milestones",
    moneyBackGuarantee: true,
    features: [
      { icon: Server, title: "Scalable Infrastructure", description: "Cloud-native setup for high concurrency." },
      { icon: BarChart, title: "Admin & Analytics", description: "Real-time metrics and user management dashboards." },
      { icon: Code2, title: "API Development", description: "Expose your own APIs for external integrations." }
    ],
    bonusOffers: [],
    timeline: [],
    process: [],
    techStack: ["Next.js", "Docker", "AWS", "Redis"],
    idealClients: ["Funded Startups"],
    faqs: []
  },
  "seo-local": {
    id: "seo-local",
    title: "Local Dominance",
    shortDescription: "Own the local search results and drive foot traffic or local leads.",
    startingPrice: "$899",
    oneTimeOption: "N/A",
    monthlyOption: "$899/mo",
    popularBadge: false,
    deliveryTime: "Ongoing",
    paymentTerms: "Monthly Retainer",
    moneyBackGuarantee: false,
    features: [
      { icon: Search, title: "Google Business Optimization", description: "Rank in the Google Local Pack." },
      { icon: Settings, title: "On-Page SEO", description: "Keyword optimization for local intent." },
      { icon: Code2, title: "Technical SEO Audit", description: "Fix site speed and indexability issues." }
    ],
    bonusOffers: [],
    timeline: [],
    process: [],
    techStack: ["Ahrefs", "Google Search Console"],
    idealClients: ["Local Businesses", "Clinics", "Law Firms"],
    faqs: []
  },
  "design-system": {
    id: "design-system",
    title: "Design System",
    shortDescription: "A comprehensive UI kit and component library for your product suite.",
    startingPrice: "$4,500",
    oneTimeOption: "$4,500 One-Time",
    popularBadge: true,
    deliveryTime: "4-6 Weeks",
    paymentTerms: "50% upfront, 50% upon completion",
    moneyBackGuarantee: true,
    features: [
      { icon: PenTool, title: "Figma Component Library", description: "Reusable, scalable components." },
      { icon: LayoutTemplate, title: "Design Guidelines", description: "Typography, color, spacing, and usage rules." },
      { icon: Code2, title: "Developer Handoff", description: "Pixel-perfect specifications and assets." }
    ],
    bonusOffers: [],
    timeline: [],
    process: [],
    techStack: ["Figma", "Storybook", "Tailwind"],
    idealClients: ["Enterprise", "Product Teams"],
    faqs: []
  }
};

export const pricingCategories = [
  {
    id: "web",
    label: "Web Development",
    packages: ["starter", "growth", "enterprise"]
  },
  {
    id: "saas",
    label: "SaaS Development",
    packages: ["saas-mvp", "saas-scale"]
  },
  {
    id: "seo",
    label: "SEO Services",
    packages: ["seo-local"]
  },
  {
    id: "design",
    label: "UI/UX Design",
    packages: ["design-system"]
  }
];

export const comparisonTableData = [
  { feature: "Custom Design", starter: true, growth: true, enterprise: true },
  { feature: "Responsive Layout", starter: true, growth: true, enterprise: true },
  { feature: "Basic SEO", starter: true, growth: true, enterprise: true },
  { feature: "Pages", starter: "Up to 5", growth: "Up to 15", enterprise: "Unlimited" },
  { feature: "Revisions", starter: "2 Rounds", growth: "Unlimited (Design)", enterprise: "Agile Sprints" },
  { feature: "CMS Integration", starter: false, growth: true, enterprise: true },
  { feature: "Custom Backend", starter: false, growth: true, enterprise: true },
  { feature: "Analytics Setup", starter: false, growth: true, enterprise: true },
  { feature: "User Authentication", starter: false, growth: true, enterprise: true },
  { feature: "API Integrations", starter: false, growth: "Up to 3", enterprise: "Unlimited" },
  { feature: "Advanced Integrations", starter: false, growth: false, enterprise: true },
  { feature: "Dedicated Manager", starter: false, growth: false, enterprise: true },
  { feature: "Support SLA", starter: "14 Days", growth: "3 Months", enterprise: "24/7 Custom SLA" }
];
