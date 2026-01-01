import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"

export function Error404() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className="min-h-screen w-full bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans selection:bg-orange-500/30"
      onMouseMove={handleMouseMove}
    >

      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large 404 Text - Base Layer (Dim) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24rem] md:text-[64rem] font-bold text-transparent [-webkit-text-stroke:_1px_rgba(255,255,255,0.05)] select-none z-0 tracking-tighter leading-none font-sans">
          404
        </div>

        {/* Large 404 Text - Highlight Layer (Spotlight) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24rem] md:text-[64rem] font-bold text-transparent [-webkit-text-stroke:_1px_var(--color-primary)] select-none z-0 tracking-tighter leading-none font-sans pointer-events-none"
          style={{
            maskImage: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`
          }}
        >
          404
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">

        {/* Text Content */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed whitespace-nowrap">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="h-9 px-6 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium tracking-wide rounded-lg transition-all shadow-lg hover:shadow-orange-500/20">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
