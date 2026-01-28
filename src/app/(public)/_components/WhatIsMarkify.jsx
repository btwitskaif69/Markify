"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bookmark,
    Search,
    FolderOpen,
    Cloud,
    Users,
    Code,
    GraduationCap,
    Lightbulb,
    Check,
    X,
    ChevronDown,
    ArrowRight,
    Sparkles,
    Lock,
    Zap,
    Globe
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Spotlight } from "@/components/ui/spotlight-new";
import SEO from "@/components/SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// FAQ Data
const faqData = [
    {
        question: "Is Markify free to use?",
        answer: "Yes! Markify offers a generous free tier that includes all core bookmarking features. Premium plans are available for power users who need advanced features like unlimited collections and priority support."
    },
    {
        question: "Can I import my existing bookmarks?",
        answer: "Absolutely. Markify supports importing bookmarks from Chrome, Firefox, Safari, and other browsers. You can also import from Raindrop.io, Pocket, and Pinboard with just a few clicks."
    },
    {
        question: "Is my data private and secure?",
        answer: "Privacy is our top priority. Your bookmarks are encrypted, and we never sell or share your data with third parties. You have full control over your information at all times."
    },
    {
        question: "Does Markify work offline?",
        answer: "The Markify browser extension allows you to save bookmarks even when offline. They'll automatically sync once you're back online."
    },
    {
        question: "Can I share collections with my team?",
        answer: "Yes! Premium users can create shared collections and collaborate with teammates, making it perfect for research teams, content creators, and development groups."
    },
    {
        question: "What browsers are supported?",
        answer: "Markify works with Chrome, Firefox, Edge, Safari, and Brave. Our web app is accessible from any modern browser on desktop or mobile."
    }
];

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 hover:bg-card/50 transition-colors">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-5 text-left"
            aria-expanded={isOpen}
        >
            <span className="font-semibold text-lg pr-4">{question}</span>
            <ChevronDown
                className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// Structured Data for SEO
const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
        }
    }))
};

const WhatIsMarkify = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "What is Markify", path: "/what-is-markify" },
    ]);
    const structuredDataList = [structuredData, breadcrumbs].filter(Boolean);

    return (
        <>
            <SEO
                title="What Is a Smart Bookmark Manager"
                description="Discover what Markify is, how it works, and why teams choose it over browser bookmarks. Learn features, compare alternatives, and see if it's right for you."
                canonical={getCanonicalUrl("/what-is-markify")}
                structuredData={structuredDataList}
            />
            <Navbar />

            <main className="bg-background text-foreground min-h-screen relative overflow-hidden">
                {/* Background Effects */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                    style={{
                        backgroundSize: "68px 68px",
                        backgroundPosition: "top center",
                    }}
                />
                <div className="pointer-events-none absolute inset-0 z-10">
                    <Spotlight />
                </div>

                {/* Hero Section */}
                <section className="relative z-20 pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span>Smart Bookmark Manager</span>
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            What is Markify?
                        </motion.h1>
                        <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Markify is a modern bookmark manager that helps you save, organize, and rediscover the content that matters most - without the chaos of browser bookmarks.
                        </motion.p>
                    </motion.div>
                </section>

                {/* What Problem It Solves */}
                <section className="relative z-20 py-20 bg-card/30 border-y border-border/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                    The Problem with Browser Bookmarks
                                </h2>
                                <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                                    We've all been there. Hundreds of bookmarks, no organization, and no way to find what you saved last month.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            icon: Search,
                                            title: "Lost in the Chaos",
                                            desc: "Important links get buried under hundreds of unsorted bookmarks. Finding what you need becomes a frustrating treasure hunt."
                                        },
                                        {
                                            icon: FolderOpen,
                                            title: "No Smart Organization",
                                            desc: "Browser bookmarks offer basic folders at best. There's no tagging, no search, no way to categorize content effectively."
                                        },
                                        {
                                            icon: Cloud,
                                            title: "Sync Headaches",
                                            desc: "Switching browsers or devices? Prepare to lose your carefully curated collection or deal with broken sync."
                                        },
                                        {
                                            icon: Globe,
                                            title: "Dead Links Everywhere",
                                            desc: "Web pages change or disappear. Browser bookmarks don't tell you when your saved links break."
                                        }
                                    ].map((problem, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            className="p-6 rounded-xl border border-border bg-card/50"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                                                <problem.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                                            <p className="text-muted-foreground">{problem.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="relative z-20 py-24 container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">How Markify Works</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Get started in minutes. Save effortlessly. Find instantly.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    step: "01",
                                    icon: Bookmark,
                                    title: "Save Anything",
                                    desc: "Use our browser extension or web app to save links with one click. Add notes and tags on the fly."
                                },
                                {
                                    step: "02",
                                    icon: FolderOpen,
                                    title: "Organize Smart",
                                    desc: "Create collections, add tags, and let Markify auto-categorize your bookmarks intelligently."
                                },
                                {
                                    step: "03",
                                    icon: Search,
                                    title: "Search Instantly",
                                    desc: "Find any bookmark in seconds with powerful full-text search across titles, descriptions, and tags."
                                },
                                {
                                    step: "04",
                                    icon: Cloud,
                                    title: "Access Anywhere",
                                    desc: "Your bookmarks sync across all devices. Web, mobile, or extension - always in sync."
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                                    className="relative text-center"
                                >
                                    <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="relative z-20 py-20 bg-card/30 border-y border-border/50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Who Uses Markify?</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Built for anyone who saves content from the web - and wants to actually find it later.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        icon: Code,
                                        title: "Developers",
                                        desc: "Save documentation, tutorials, Stack Overflow answers, and GitHub repos in organized collections."
                                    },
                                    {
                                        icon: GraduationCap,
                                        title: "Students & Researchers",
                                        desc: "Collect research papers, articles, and study materials with tags for easy retrieval during exams or projects."
                                    },
                                    {
                                        icon: Lightbulb,
                                        title: "Content Creators",
                                        desc: "Curate inspiration, reference materials, and competitor content for your next big project."
                                    },
                                    {
                                        icon: Users,
                                        title: "Teams",
                                        desc: "Share curated link collections with your team. Perfect for onboarding, research, and knowledge sharing."
                                    }
                                ].map((user, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                                            <user.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{user.title}</h3>
                                        <p className="text-muted-foreground text-sm">{user.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Markify vs Browser Bookmarks */}
                <section className="relative z-20 py-24 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Markify vs Browser Bookmarks</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                See why thousands have switched from built-in browser bookmarks to Markify.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="rounded-2xl border border-border overflow-hidden bg-card/50"
                        >
                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 border-b border-border font-semibold">
                                <div>Feature</div>
                                <div className="text-center">Browser Bookmarks</div>
                                <div className="text-center text-primary">Markify</div>
                            </div>
                            {[
                                { feature: "Full-text search", browser: false, markify: true },
                                { feature: "Custom tags", browser: false, markify: true },
                                { feature: "Cross-browser sync", browser: false, markify: true },
                                { feature: "Notes & descriptions", browser: false, markify: true },
                                { feature: "Shared collections", browser: false, markify: true },
                                { feature: "Mobile app access", browser: false, markify: true },
                                { feature: "Broken link detection", browser: false, markify: true },
                                { feature: "Import/Export", browser: true, markify: true },
                            ].map((row, idx) => (
                                <div key={idx} className={`grid grid-cols-3 gap-4 p-4 ${idx % 2 === 0 ? 'bg-card/30' : ''}`}>
                                    <div className="font-medium">{row.feature}</div>
                                    <div className="flex justify-center">
                                        {row.browser ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-muted-foreground/50" />
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        {row.markify ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-muted-foreground/50" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Markify vs Alternatives */}
                <section className="relative z-20 py-20 bg-card/30 border-y border-border/50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Markify vs Raindrop.io & Pinboard</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    An honest comparison with popular bookmark managers. All are solid choices - here's how they differ.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        name: "Markify",
                                        highlight: true,
                                        features: [
                                            "Free tier with core features",
                                            "Modern, intuitive interface",
                                            "Fast & lightweight",
                                            "Privacy-first approach",
                                            "Browser extension included",
                                            "Team collaboration (Pro)"
                                        ]
                                    },
                                    {
                                        name: "Raindrop.io",
                                        highlight: false,
                                        features: [
                                            "Free tier available",
                                            "Rich visual bookmarks",
                                            "Robust organization",
                                            "Full-text search (Pro)",
                                            "Browser extension included",
                                            "Team features (Pro)"
                                        ]
                                    },
                                    {
                                        name: "Pinboard",
                                        highlight: false,
                                        features: [
                                            "One-time payment model",
                                            "Minimalist design",
                                            "No-frills, fast",
                                            "Strong privacy focus",
                                            "Browser extension (third-party)",
                                            "No team features"
                                        ]
                                    }
                                ].map((tool, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                                        className={`p-6 rounded-xl border ${tool.highlight ? 'border-primary bg-primary/5' : 'border-border bg-card/50'}`}
                                    >
                                        <h3 className={`text-xl font-bold mb-4 ${tool.highlight ? 'text-primary' : ''}`}>
                                            {tool.name}
                                        </h3>
                                        <ul className="space-y-3">
                                            {tool.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-center text-muted-foreground mt-8 text-sm">
                                Each tool has its strengths. Markify focuses on speed, simplicity, and privacy while offering powerful organization features.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="relative z-20 py-24 container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                            <p className="text-lg text-muted-foreground">
                                Got questions? We've got answers.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {faqData.map((faq, idx) => (
                                <FAQItem
                                    key={idx}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openFAQ === idx}
                                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                                />
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative z-20 py-24 container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] animate-[shimmer_3s_infinite]" />

                        <h2 className="relative z-10 text-3xl md:text-5xl font-bold mb-6">Ready to try Markify?</h2>
                        <p className="relative z-10 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Join thousands who have transformed how they save and organize the web.
                        </p>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Get Started Free
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default WhatIsMarkify;
