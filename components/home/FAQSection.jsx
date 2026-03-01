"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Why teams choose Markify as their bookmark manager",
        answer:
            "Markify helps teams turn scattered links into a searchable knowledge system. Instead of losing research across browser tabs, chat threads, and docs, you can capture sources once, organize them into clear collections, and find them again instantly from any device.\n\nFor content teams, that means faster campaign planning and easier handoffs. For product and growth teams, it means less duplicate research and better competitive visibility. For support and operations teams, it means a single source of truth that stays easy to maintain.",
    },
    {
        question: "Core workflow benefits",
        answer:
            "- Save links in one click with browser extensions and keep metadata intact.\n- Group bookmarks by project, team, customer segment, or campaign stage.\n- Tag and search by keyword, URL, title, and context to retrieve results faster.\n- Share collections with teammates without rebuilding links manually.\n- Keep your library clean with reusable structures that scale as your team grows.",
    },
    {
        question: "How to build a scalable bookmark workflow",
        answer:
            "A strong bookmark workflow starts with consistency. Teams that save links in different apps usually lose context, duplicate research, and waste time trying to reconstruct decisions. Markify solves this by giving every team a shared structure for capture, organization, and retrieval. When links are saved with tags, collection context, and clear naming, your knowledge base becomes a reusable asset.\n\nThe first step is creating collection standards that match how your team already works. Most teams organize by function, project, and lifecycle stage. For example, marketing teams can keep separate collections for campaign research, messaging references, and competitive examples. Product teams can separate user insights, technical references, and launch checklists.\n\nTagging improves search quality when tags are predictable and limited. Instead of creating dozens of one-off labels, define a short set for intent, audience, and priority. This makes it easier to filter results quickly and keeps your library clean as it grows over time. Shared naming rules reduce ambiguity and help new teammates onboard faster.",
    },
    {
        question: "Practical checklist for teams",
        answer:
            "- Define collection naming rules before adding large volumes of links.\n- Use tags for intent and audience, not for temporary notes.\n- Capture a short description so each saved resource keeps context.\n- Review and merge duplicate collections at least once per month.\n- Share curated collections for handoffs across teams and stakeholders.\n- Archive outdated links to keep active search results relevant.\n- Track high-value references in dedicated strategy collections.\n- Use one source of truth for links to avoid scattered documentation.\n\nTeams that follow this process spend less time searching and more time shipping. Whether you are planning campaigns, running competitive research, or building product strategy, a searchable bookmark system improves speed, clarity, and collaboration quality.",
    },
];

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
    return (
        <motion.div
            className={cn(
                "border-b border-border/50 overflow-hidden",
                "hover:bg-muted/30 transition-colors duration-200"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: false }}
        >
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between py-5 px-4 md:px-6 text-left"
            >
                <span className="text-sm md:text-base text-foreground font-medium pr-4">
                    {question}
                </span>
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {isOpen ? (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                    )}
                </span>
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
                        <p className="px-4 md:px-6 pb-5 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-2xl md:text-6xl font-medium bg-clip-text text-transparent leading-normal" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        How <span className="instrument-serif-regular-italic">Markify</span> helps you?
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Markify offers ready-made solutions to get you going fast. Easily
                        customize as your needs expand.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
