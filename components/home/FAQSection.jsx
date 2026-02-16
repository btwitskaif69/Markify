"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "What is Markify, and how does it help with bookmark management?",
        answer: "Markify is a modern bookmark management tool that helps you save, organize, and find your bookmarks effortlessly. With AI-powered tagging, smart collections, and lightning-fast search, you'll never lose track of important links again.",
    },
    {
        question: "Can Markify be customized for different teams and projects?",
        answer: "Absolutely! Markify offers flexible collections and tags that can be tailored to any workflow. Whether you're managing research, content planning, or team resources, you can create custom organizational structures that fit your needs.",
    },
    {
        question: "Does Markify support sync across multiple browsers and devices?",
        answer: "Yes! Markify syncs your bookmarks in real-time across all your browsers and devices. Access your entire bookmark library from Chrome, Firefox, Edge, Safari, or any device with our web app.",
    },
    {
        question: "What features does Markify offer for organizing bookmarks?",
        answer: "Markify provides smart collections, AI-powered auto-tagging, favorites, custom tags, and powerful search with filters. You can also share collections with teammates and export your bookmarks anytime.",
    },
    {
        question: "How does Markify help with finding bookmarks quickly?",
        answer: "Our lightning-fast search (Cmd+K) lets you find any bookmark instantly. Search by title, URL, tags, or even page content. Advanced filters help narrow down results in large libraries.",
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
                        <p className="px-4 md:px-6 pb-5 text-sm text-muted-foreground">
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
                    <h2 className="text-2xl md:text-6xl font-medium bg-gradient-to-b from-foreground to-primary/90 bg-clip-text text-transparent leading-normal">
                        How <span className="italic">Markify</span> helps you?
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
