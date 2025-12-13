import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Bookmark, Globe, Star } from "lucide-react";

const stats = [
    {
        icon: Users,
        value: 2500,
        suffix: "+",
        label: "Active Users",
        color: "text-blue-500",
    },
    {
        icon: Bookmark,
        value: 150000,
        suffix: "+",
        label: "Bookmarks Saved",
        color: "text-orange-500",
    },
    {
        icon: Globe,
        value: 50,
        suffix: "+",
        label: "Countries",
        color: "text-green-500",
    },
    {
        icon: Star,
        value: 4.9,
        suffix: "",
        label: "Average Rating",
        color: "text-yellow-500",
        isDecimal: true,
    },
];

const formatNumber = (num, isDecimal) => {
    if (isDecimal) return num.toFixed(1);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
};

const AnimatedCounter = ({ value, suffix, isDecimal }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {formatNumber(count, isDecimal)}{suffix}
        </span>
    );
};

const Stats = () => {
    return (
        <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
                {/* Background Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border p-8 md:p-12"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    {/* Stats Grid */}
                    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm mb-4 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>

                                {/* Value */}
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        isDecimal={stat.isDecimal}
                                    />
                                </div>

                                {/* Label */}
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Stats;
