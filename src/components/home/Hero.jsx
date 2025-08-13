import React from 'react'
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
  <section className="bg-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
        {/* Left side - centered text */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start min-h-[60vh] text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
            Markify — Your Ultimate Bookmark Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Organize, sync, and access your bookmarks seamlessly across devices. Save time, stay productive.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right side - hero illustration */}
        <div className="flex-1 max-w-lg w-full">
          <div className="aspect-video rounded-lg bg-gradient-to-tr from-blue-400 to-purple-600 shadow-lg flex items-center justify-center text-white text-2xl font-semibold select-none">
            Markify Illustration
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero