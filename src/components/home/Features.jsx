import React from "react";
import { motion } from "framer-motion";
import {
    Search,
    FolderOpen,
    Star,
    Upload,
    Tags,
    Moon,
    Zap,
    Shield
} from "lucide-react";

const features = [
    {
        icon: Search,
        title: "Lightning Search",
        description: "Find any bookmark instantly with Cmd+K. Search by title, URL, tags, or description.",
        className: "md:col-span-2 md:row-span-1",
        gradient: "from-orange-500/20 to-red-500/20",
    },
    {
        icon: FolderOpen,
        title: "Smart Collections",
        description: "Organize bookmarks into custom collections for easy access.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        icon: Star,
        title: "Quick Favorites",
        description: "Star your most important links for instant access.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
        icon: Upload,
        title: "Import & Export",
        description: "Easily import from Chrome, Firefox, or export in JSON, CSV, HTML formats.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
        icon: Tags,
        title: "Auto-Tagging",
        description: "AI-powered tag suggestions to keep your bookmarks organized automatically.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
        icon: Shield,
        title: "Privacy First",
        description: "Your data stays yours. No tracking, no selling, just bookmarks.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-slate-500/20 to-zinc-500/20",
    },
    {
        icon: Moon,
        title: "Beautiful Dark Mode",
        description: "Easy on the eyes with a stunning dark theme that looks great.",
        className: "md:col-span-1 md:row-span-1",
        gradient: "from-indigo-500/20 to-violet-500/20",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const Features = () => {
    return (
        <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Everything you need to manage bookmarks
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Markify comes packed with features designed to make bookmark management effortless and enjoyable.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 ${feature.className}`}
                        >
                            {/* Gradient Background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
