"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "What is Markify and how does it work?",
    answer:
      "Markify is a modern bookmark manager that lets you save, organize, and search your links in one place. Unlike browser bookmarks, Markify offers collections, tags, and smart search so you can actually find what you saved — across every device.",
  },
  {
    question: "Is Markify free to use?",
    answer:
      "Yes! Markify has a generous free plan that covers individual use. For teams and power users who need shared collections, advanced search, and priority support, we offer affordable paid plans.",
  },
  {
    question: "Can I import bookmarks from my browser?",
    answer:
      "Absolutely. Markify supports one-click import from Chrome, Firefox, Safari, Edge, and any browser that exports an HTML bookmarks file. Your existing folder structure is preserved during import.",
  },
  {
    question: "How do collections and tags work?",
    answer:
      "Collections are folders for grouping related bookmarks — think of them as curated playlists for your links. Tags add an extra layer of searchability, letting you find bookmarks across multiple collections with a single keyword.",
  },
  {
    question: "Can I share bookmarks with my team?",
    answer:
      "Yes. Shared collections let you collaborate with teammates in real-time. Everyone sees the same curated links, and changes sync instantly. Perfect for research teams, dev squads, or design inspiration boards.",
  },
  {
    question: "Is my bookmark data private?",
    answer:
      "Completely. Your bookmarks are private by default and only visible to you. Shared collections are visible only to people you explicitly invite. We never sell, share, or mine your data.",
  },
  {
    question: "Does Markify have a browser extension?",
    answer:
      "Yes, our browser extension lets you save any page with one click. It auto-fills the title and description, and lets you pick a collection and add tags — all without leaving the page you're on.",
  },
  {
    question: "Can I export my data if I want to leave?",
    answer:
      "Yes — we believe your data is yours. You can export all your bookmarks, collections, and tags at any time in standard formats. No vendor lock-in, ever.",
  },
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "relative overflow-hidden rounded-xl border transition-colors duration-300",
        isOpen ? "bg-background" : "bg-card"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%),
            radial-gradient(circle at bottom right, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%)
          `,
        }}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span
          className={cn(
            "text-lg font-medium transition-colors duration-300",
            isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Plus
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? contentHeight + 16 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.3, ease: "easeInOut" },
        }}
        className="relative z-10 overflow-hidden px-4"
      >
        <div ref={contentRef}>
          <p className="pb-4 text-muted-foreground">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HomeFAQ() {
  return (
    <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-6xl font-medium bg-clip-text text-transparent leading-normal" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
            How <span className="instrument-serif-regular-italic">Markify</span> helps you?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Markify. Can't find what you're
            looking for? Reach out to our support team.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <FAQItem {...faq} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
