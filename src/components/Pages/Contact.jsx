import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spotlight } from "../ui/spotlight-new";

const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
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
              Contact us
            </h1>
            <p className="text-muted-foreground mb-6">
              Have a question, feature idea, or partnership opportunity?
              Send us a message and we’ll get back to you as soon as we can.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                hello@example.com
              </p>
              <p>
                <span className="font-medium text-foreground">Address:</span>{" "}
                123 Innovation Street, Tech City
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  name="message"
                  rows={5}
                  placeholder="How can we help?"
                  required
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;

