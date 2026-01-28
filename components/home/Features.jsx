import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { FEATURES } from "@/data/features";
import { FEATURE_ICONS } from "@/data/featureIcons";

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
                    {FEATURES.map((feature, index) => {
                        const Icon = FEATURE_ICONS[feature.iconKey];
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 ${feature.layout}`}
                            >
                                {/* Gradient Background */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    {Icon ? (
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                    ) : null}
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
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
