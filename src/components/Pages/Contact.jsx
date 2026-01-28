"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spotlight } from "../ui/spotlight-new";
import SEO from "../SEO/SEO";
import { SITE_CONFIG, buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { API_BASE_URL } from "@/lib/apiConfig";
import { toast } from "sonner";
import {
  Loader2, Mail, Phone, Building2, MessageSquare, Send, CheckCircle,
  Clock, Users, Zap, HelpCircle, ChevronDown, MapPin, Globe
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        toast.error("Failed to send message", {
          description: data.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  const subjectOptions = [
    "General Inquiry",
    "Feature Request",
    "Bug Report",
    "Partnership",
    "Enterprise Sales",
    "Other",
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      value: "support@markify.tech",
      href: "mailto:support@markify.tech",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "We reply fast",
      value: "Within 24 hours",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Available worldwide",
      value: "24/7 Support",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "50,000+", label: "Bookmarks Saved" },
    { value: "4.9/5", label: "User Rating" },
    { value: "<24h", label: "Response Time" }
  ];

  const faqs = [
    {
      question: "How do I get started with Markify?",
      answer: "Simply sign up for a free account, install our browser extension, and start saving bookmarks with one click. All your bookmarks sync automatically across devices."
    },
    {
      question: "Is Markify free to use?",
      answer: "Yes! Markify offers a generous free tier with unlimited bookmarks. Premium features like advanced search, team collaboration, and AI-powered organization are available on paid plans."
    },
    {
      question: "Can I import my existing bookmarks?",
      answer: "Absolutely! You can import bookmarks from Chrome, Firefox, Safari, or any browser. Just export your bookmarks as an HTML file and upload it to Markify."
    },
    {
      question: "How secure are my bookmarks?",
      answer: "Your data is encrypted at rest and in transit. We use industry-standard security practices and never sell your data. You own your bookmarks, always."
    }
  ];

  return (
    <>
      <SEO
        title="Contact Support & Sales"
        description="Contact the Markify team for support, partnerships, or enterprise pricing. Send a message and we'll reply within 24 hours."
        canonical={getCanonicalUrl("/contact")}
        keywords={["contact Markify", "Markify support", "Markify help"]}
        webPageType="ContactPage"
        structuredData={breadcrumbs ? [breadcrumbs] : null}
      />
      <Navbar />

      <main className="bg-background text-foreground relative overflow-hidden">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
          style={{
            backgroundSize: "68px 68px",
            backgroundPosition: "0 0",
            opacity: 1,
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Spotlight */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 md:pt-24 pb-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <MessageSquare className="h-4 w-4" />
              We'd love to hear from you
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question, feature idea, or partnership opportunity?
              Our team is here to help you make the most of Markify.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Contact Methods + Form Section */}
        <section className="container mx-auto px-4 pb-16 grid gap-8 lg:grid-cols-5 relative z-20">
          {/* Left Column - Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Method Cards */}
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                variants={cardVariants}
                whileHover="hover"
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${method.gradient} p-[1px] rounded-2xl`}>
                  <div className="absolute inset-[1px] rounded-2xl bg-card" />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${method.gradient} text-white shadow-lg`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    {method.href ? (
                      <a
                        href={method.href}
                        className="font-medium text-primary hover:underline transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="font-medium text-foreground">{method.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* FAQ Section */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    className="border border-border/50 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm pr-4">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </motion.div>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedFaq === index ? "auto" : 0,
                        opacity: expandedFaq === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-2">Explore Markify</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Learn more about what Markify can do for you.
              </p>
              <div className="flex flex-wrap gap-2">
                  {[
                  { label: "Features", href: "/features" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Blog", href: "/blog" },
                  { label: "About", href: "/about" }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-border bg-card shadow-2xl shadow-primary/5 p-6 md:p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="p-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mb-6"
                  >
                    <CheckCircle className="h-14 w-14 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-background/50 border-border/50 focus:border-primary transition-all h-12 rounded-xl"
                        />
                      </motion.div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-background/50 border-border/50 focus:border-primary transition-all h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Phone <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-background/50 border-border/50 focus:border-primary transition-all h-12 rounded-xl pl-11"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Company <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            name="company"
                            placeholder="Your company"
                            value={formData.company}
                            onChange={handleChange}
                            className="bg-background/50 border-border/50 focus:border-primary transition-all h-12 rounded-xl pl-11"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl border border-border/50 bg-background/50 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                      >
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="message"
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-background/50 border-border/50 focus:border-primary transition-all resize-none rounded-xl"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/25"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      By submitting this form, you agree to our{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-orange-500 to-red-500 p-8 md:p-12 text-center"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>

            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Ready to organize your bookmarks?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who've transformed their digital workspace with Markify.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="rounded-full px-8 font-medium">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="ghost" className="rounded-full px-8 font-medium text-white border-white/30 hover:bg-white/10">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
