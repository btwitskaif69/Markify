import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Bookmark, FolderOpen, Zap } from "lucide-react";

// Confetti animation using canvas
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

        // Create particles
        for (let i = 0; i < particleCount; i++) {
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
            particles.forEach((p) => {
                if (p.opacity > 0.01) {
                    allDone = false;
                    p.vy += p.gravity;
                    p.vx *= p.friction;
                    p.vy *= p.friction;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rotation += p.rotationSpeed;
                    p.opacity -= 0.008;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = p.opacity;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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

const features = [
    { icon: Bookmark, title: "Save Bookmarks", description: "One-click save from anywhere" },
    { icon: FolderOpen, title: "Organize Collections", description: "Group bookmarks your way" },
    { icon: Zap, title: "Quick Access", description: "Ctrl+K to search instantly" },
];

export function WelcomeDialog({ open, onOpenChange, userName }) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (open) {
            // Delay confetti slightly for effect
            const timer = setTimeout(() => setShowConfetti(true), 200);
            return () => clearTimeout(timer);
        } else {
            setShowConfetti(false);
        }
    }, [open]);

    return (
        <>
            <Confetti active={showConfetti} />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md overflow-hidden">
                    <DialogHeader className="text-center pb-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg"
                        >
                            <Sparkles className="h-8 w-8 text-white" />
                        </motion.div>
                        <DialogTitle className="text-2xl font-bold">
                            Welcome to Markify{userName ? `, ${userName.split(" ")[0]}` : ""}! 🎉
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Your bookmark journey starts here. Let's make the web more organized!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{feature.title}</p>
                                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => onOpenChange(false)}
                        >
                            Let's Get Started!
                        </Button>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default WelcomeDialog;
