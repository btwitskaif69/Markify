"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Bookmark, FolderOpen, Zap } from "lucide-react";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Onboarding } from "@/components/ui/onboarding";
import { useTheme } from "@/components/theme-provider";

const ADDBOOKMARK_DARK = "https://assets.markify.tech/assets/addbookmark-dark.png";
const ADDBOOKMARK_LIGHT = "https://assets.markify.tech/assets/addbookmark-light.png";
const SEARCH_DARK = "https://assets.markify.tech/assets/search-dark.png";
const SEARCH_LIGHT = "https://assets.markify.tech/assets/search-light.png";

function Confetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#ff6b00", "#ff8c00", "#ffa500", "#ffb347", "#ffd700", "#fff"];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3,
        friction: 0.99,
        opacity: 1,
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDone = true;
      particles.forEach((particle) => {
        if (particle.opacity > 0.01) {
          allDone = false;
          particle.vy += particle.gravity;
          particle.vx *= particle.friction;
          particle.vy *= particle.friction;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;
          particle.opacity -= 0.008;

          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
          ctx.restore();
        }
      });

      if (!allDone) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

Confetti.propTypes = {
  active: PropTypes.bool.isRequired,
};

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

function TipRow({ index, title, description }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex gap-3 rounded-xl border border-border/60 bg-background/70 p-4"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {index}
      </div>
      <div className="space-y-1">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

TipRow.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const coreFeatures = [
  {
    icon: Bookmark,
    title: "Save bookmarks",
    description: "Capture pages with title, link, and preview details.",
  },
  {
    icon: FolderOpen,
    title: "Use collections",
    description: "Group related links by project, topic, or client.",
  },
  {
    icon: Zap,
    title: "Find things fast",
    description: "Search instantly or jump with keyboard shortcuts.",
  },
];

const saveTips = [
  {
    title: "Click Add Bookmark",
    description: "Use the orange button in the top-right whenever you want to save a page.",
  },
  {
    title: "Paste the link",
    description: "Markify fills in the title and preview so you can save faster.",
  },
  {
    title: "Pick a collection",
    description: "Keep the bookmark in All Bookmarks or file it into a collection.",
  },
];

const organizeTips = [
  {
    title: "Create collections",
    description: "Separate research, ideas, and work links so they stay easy to browse.",
  },
  {
    title: "Use global search",
    description: "Search across titles, URLs, and saved content from the dashboard.",
  },
  {
    title: "Import later",
    description: "You can bring in existing bookmarks whenever you are ready.",
  },
];

export default function OnboardingDialog({ open, onOpenChange, userName }) {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowConfetti(true), 200);
      return () => clearTimeout(timer);
    }

    setShowConfetti(false);
    return undefined;
  }, [open]);

  const firstName = userName ? userName.split(" ")[0] : "";

  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-7xl overflow-hidden border-border bg-background p-0">
          <div className="relative max-h-[90vh] overflow-y-auto">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(234,88,12,0.14),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

            <Onboarding
              totalSteps={3}
              defaultValue={1}
              onComplete={() => onOpenChange(false)}
              className="relative border-0 bg-transparent p-6 shadow-none md:p-8"
            >
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Onboarding
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                      Welcome to Markify{firstName ? `, ${firstName}` : ""}.
                    </h2>
                    <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                      A short tour to help you save, organize, and find your bookmarks faster.
                    </p>
                  </div>
                </div>

                <Onboarding.StepIndicator className="hidden justify-end md:flex" variant="pills" />
              </div>

              <div className="mb-6 md:hidden">
                <Onboarding.StepIndicator className="justify-start" variant="pills" />
              </div>

              <Onboarding.Step step={1}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    {coreFeatures.map((feature) => (
                      <FeatureCard key={feature.title} {...feature} />
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
                    Use this dashboard as your command center. Everything you save is searchable and ready when you need it.
                  </div>
                </motion.div>
              </Onboarding.Step>

              <Onboarding.Step step={2}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
                >
                  <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Save fast
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">Capture links in seconds.</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start with the Add Bookmark button in the top-right. Markify will do the rest.
                    </p>

                    <div className="mt-4 space-y-2">
                      {saveTips.map((tip, index) => (
                        <TipRow
                          key={tip.title}
                          index={index + 1}
                          title={tip.title}
                          description={tip.description}
                        />
                      ))}
                    </div>
                  </div>

                  <Image
                    src={theme === "dark" ? ADDBOOKMARK_DARK : ADDBOOKMARK_LIGHT}
                    alt="Add Bookmark dialog preview"
                    width={800}
                    height={700}
                    className="w-full h-full object-cover object-left-top rounded-2xl border border-border/60 bg-card/70"
                    sizes="(max-width: 768px) 90vw, 600px"
                  />
                </motion.div>
              </Onboarding.Step>

              <Onboarding.Step step={3}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
                >
                  <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      Stay organized
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">Keep collections tidy.</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Collections and search make larger bookmark libraries easy to manage.
                    </p>

                    <div className="mt-4 space-y-2">
                      {organizeTips.map((tip, index) => (
                        <TipRow
                          key={tip.title}
                          index={index + 1}
                          title={tip.title}
                          description={tip.description}
                        />
                      ))}
                    </div>
                  </div>

                  <Image
                    src={theme === "dark" ? SEARCH_DARK : SEARCH_LIGHT}
                    alt="Search feature preview"
                    width={800}
                    height={700}
                    className="w-full h-full object-cover object-left-top rounded-2xl border border-border/60 bg-card/70"
                    sizes="(max-width: 768px) 90vw, 600px"
                  />
                </motion.div>
              </Onboarding.Step>

              <Onboarding.Navigation
                backLabel="Back"
                nextLabel="Next"
                completeLabel="Start exploring"
                className="mt-8"
              />
            </Onboarding>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

OnboardingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  userName: PropTypes.string,
};
