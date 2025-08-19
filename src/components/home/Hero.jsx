import React from 'react'
import { Button } from "@/components/ui/button";
import { Spotlight } from '../ui/spotlight-new';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-x-clip">
      <Spotlight/>

      {/* Hero Content */}
      <section className="relative z-10 w-full flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center space-y-6">

          {/* Tagline */}
          <Button 
            variant="outline"  
            className="bg-transparent border px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium"
          >
            <span className="text-yellow-400">✨</span>
            Never Lose a Bookmark Again
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-medium leading-tight tracking-tight text-foreground max-w-5xl">
            Save, Organize, and Access Your Bookmarks Smarter
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Keep every link organized, searchable, and accessible with Markify’s clean, modern bookmark manager.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button size="lg" className="text-lg rounded-xl shadow-md">
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg rounded-xl border-foreground/20 hover:bg-foreground/10"
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
