import React from 'react'
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      {/* Radial Gradient Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-700"
      >
        <div className="w-full h-full bg-[radial-gradient(125%_125%_at_50%_10%,#ffffff_40%,#f54900_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#0a0a0a_40%,#f54900_100%)]" />
      </div>

      {/* Hero Content */}
      <section className="relative z-10 w-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center space-y-6">
          
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground max-w-3xl">
            Markify — Your Ultimate Bookmark Manager
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Organize, sync, and access your bookmarks seamlessly across devices.  
            Save time, stay productive.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg rounded-xl shadow-md">
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl border-foreground/20 hover:bg-foreground/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
