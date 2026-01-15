import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { Loader2, Mail, Phone, Building2, MessageSquare, Send, CheckCircle } from "lucide-react";

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

  const quickLinks = [
    { label: "Explore features", to: "/features" },
    { label: "Browse solutions", to: "/solutions" },
    { label: "See pricing", to: "/pricing" },
    { label: "Read the blog", to: "/blog" },
    { label: "What is Markify?", to: "/what-is-markify" },
  ];

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the Markify team. Have a question, feature idea, or partnership opportunity? Send us a message and we'll get back to you."
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

        {/* Spotlight */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        <section className="container mx-auto px-4 py-16 md:py-24 grid gap-10 md:grid-cols-2 relative z-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
              Have a question, feature idea, or partnership opportunity?
              We'd love to hear from you. Send us a message and our team will get back to you within 24 hours.
            </p>

            {/* Contact Info Cards */}
            <div className="grid gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/60">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email us at</p>
                  <a
                    href="mailto:support@markify.tech"
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    support@markify.tech
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/60">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response time</p>
                  <p className="font-medium text-foreground">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="text-lg font-semibold mb-2">Quick links</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Looking for product details? These pages answer the most common questions.
              </p>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Thank you for reaching out. We'll review your message and get back to you as soon as possible.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Phone <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-background pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Company <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        name="company"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-background pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;
