import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  Target,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Spotlight } from "../ui/spotlight-new";
import SEO from "../SEO/SEO";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const About = () => {
  return (
    <>
      <SEO
        title="About Us - Markify"
        description="Discover the story behind Markify. We're on a mission to revolutionize how you organize and access the web."
        canonical="https://www.markify.tech/about"
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen relative overflow-hidden">
        {/* Background Effects */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          style={{
            backgroundSize: "68px 68px",
            backgroundPosition: "top center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        {/* Hero Section */}
        <section className="relative z-20 pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span>Our Story</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Transforming how you <br className="hidden md:block" /> organize the web.
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Markify isn't just a bookmark manager; it's your personal corner of the internet, designed to help you capture, organize, and rediscover the content that shapes your world.
            </motion.p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="relative z-20 py-20 bg-card/30 border-y border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    The web is infinite, but your attention is limited. We believe that managing your digital resources shouldn't feel like a chore.
                  </p>
                  <p>
                    Our mission is to build the most intuitive, beautiful, and private way to save the web. We want to empower creators, developers, and learners to build their own libraries of knowledge without the noise.
                  </p>
                </div>
              </motion.div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-2xl opacity-50" />
                <div className="relative rounded-xl border border-border bg-card/80 p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-green-500/10 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Privacy First</h3>
                        <p className="text-muted-foreground">Your data is yours. We don't sell it, share it, or spy on it.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-blue-500/10 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Lightning Fast</h3>
                        <p className="text-muted-foreground">Built for speed, because seconds matter when you're in the flow.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-amber-500/10 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Design Driven</h3>
                        <p className="text-muted-foreground">A tool you look at every day should be beautiful to use.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="relative z-20 py-24 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built on core values</h2>
            <p className="text-lg text-muted-foreground">
              These principles guide every feature we build and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Uncompromising Privacy",
                desc: "We believe privacy is a fundamental right. Markify is built with privacy-preserving architecture from the ground up."
              },
              {
                icon: Zap,
                title: "Ruthless Efficiency",
                desc: "We obsess over milliseconds. Markify is optimized for keyboard warriors and power users who value speed."
              },
              {
                icon: Heart,
                title: "User-Centric Design",
                desc: "We listen to our community. Markify evolves based on real feedback from the people who use it every day."
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group p-8 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Creator Section */}
        <section className="relative z-20 py-24 bg-card/30 border-t border-border/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet the Creator</h2>
              <p className="text-lg text-muted-foreground">
                Markify is a one-man show, built with passion and caffeine by a developer who loves solving problems.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl overflow-hidden bg-card border border-border p-8"
              >
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-background shadow-xl mb-6 overflow-hidden relative">
                  <img
                    src="/images/mohd-kaif.jpg"
                    alt="Mohd Kaif"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mohd Kaif</h3>
                <p className="text-primary font-medium mb-4">Founder & Developer</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I created Markify to solve my own problem of organizing scattered digital resources. I run the entire project solo—from writing the code to designing the pixels and managing the servers.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="https://github.com/btwitskaif69" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                  <a href="https://twitter.com/btwitskaif69" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                  <a href="https://www.linkedin.com/in/btwitskaif69/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-20 py-24 container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-primary/5 border border-primary/20 p-12 md:p-20 text-center">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] animate-[shimmer_3s_infinite]" />

            <h2 className="relative z-10 text-3xl md:text-5xl font-bold mb-6">Ready to get organized?</h2>
            <p className="relative z-10 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of users who have already transformed their digital workflow with Markify.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Get Started for Free
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;


