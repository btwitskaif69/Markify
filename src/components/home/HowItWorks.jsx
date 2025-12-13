import React from "react";
import { motion } from "framer-motion";
import { Bookmark, FolderPlus, Search, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Bookmark,
        title: "Save",
        description: "Add bookmarks instantly with our browser extension or paste URLs directly. Metadata is extracted automatically.",
        color: "from-orange-500 to-red-500",
    },
    {
        number: "02",
        icon: FolderPlus,
        title: "Organize",
        description: "Create collections, add tags, and let AI suggest categories. Keep everything neat and accessible.",
        color: "from-blue-500 to-cyan-500",
    },
    {
        number: "03",
        icon: Search,
        title: "Access",
        description: "Find any bookmark in milliseconds with Cmd+K. Search by title, URL, tags, or even content.",
        color: "from-green-500 to-emerald-500",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const HowItWorks = () => {
    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <ArrowRight className="w-4 h-4" />
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Three simple steps to organized bookmarks
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Get started in minutes and never lose a bookmark again.
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-border to-transparent" />
                            )}

                            {/* Card */}
                            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 h-full hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                                {/* Step Number */}
                                <div className={`absolute top-4 right-4 text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-20`}>
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
