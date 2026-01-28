import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Is Markify free to use?",
        answer: "Yes! Markify offers a generous free tier with unlimited bookmarks, collections, and search. Premium features like AI-powered tagging and advanced analytics are available with our Pro plan.",
    },
    {
        question: "Can I import my bookmarks from Chrome or Firefox?",
        answer: "Absolutely! Markify supports importing bookmarks from Chrome, Firefox, Safari, and Edge. You can import via HTML export file or use our browser extension for seamless sync.",
    },
    {
        question: "Is my data secure?",
        answer: "Security is our top priority. All data is encrypted at rest and in transit. We never sell your data or show you ads. Your bookmarks are 100% private.",
    },
    {
        question: "Can I access my bookmarks on multiple devices?",
        answer: "Yes! Your bookmarks sync across all your devices automatically. Access them from your desktop, laptop, tablet, or phone wherever you go.",
    },
    {
        question: "How does the AI tagging work?",
        answer: "When you save a bookmark, our AI analyzes the page content and suggests relevant tags. You can accept, modify, or add your own tags. The more you use Markify, the smarter it gets!",
    },
    {
        question: "Can I share collections with others?",
        answer: "Yes! You can create public share links for any collection. Perfect for sharing resources with teammates, students, or friends. You control who can access what.",
    },
];

const FAQ = () => {
    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <HelpCircle className="w-4 h-4" />
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Frequently asked questions
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about Markify.
                    </p>
                </motion.div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-border rounded-xl px-6 bg-card data-[state=open]:bg-card/80 transition-colors"
                            >
                                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
