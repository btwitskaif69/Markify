import React from 'react'
import { Search, ShieldUser, Folders, Share2, RefreshCw } from 'lucide-react';
import bg from '@/assets/global-search.png'
import collections from'@/assets/collections.png'
import share from'@/assets/share.png'

 
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
 
const features = [
  {
    Icon: Folders,
    name: "Smart Collections-Organization",
    description: "AI-powered categorization that learns from your browsing habits and automatically sorts bookmarks into intelligent collections.",
    href: "/",
    cta: "Learn more",
    background: <img src={collections} className="absolute -top-25  scale-102 hover:scale-106 ease-in-out duration-300 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_75%,#000_100%)]" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Search,
    name: "Lightning-Fast Global Search",
    description: "Find any bookmark in milliseconds with our advanced CMD+K or CTRL+K search that understands context, tags, and content.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute scale-170 duration-300 brightness-150 contrast-125 hover:scale-180 ease-in-out [--duration:20s]
                                        [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ShieldUser,
    name: "Privacy-First Design",
    description: "Your bookmarks stay yours. End-to-end encryption ensures your browsing history remains completely private.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: RefreshCw,
    name: "Universal Sync",
    description: "Access your bookmarks anywhere, anytime. Seamless synchronization across all your devices and browsers.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Share2,
    name: "Shareable Bookmarks",
    description:
      "Share Bookmarks with your team and friends in one click",
    href: "/",
    cta: "Learn more",
    background: <img src={share} className="absolute -top-1  scale-100 hover:scale-110 ease-in-out duration-300 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

const Features = () => {
  return (
   <section className="py-12">
<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header: improved h1 + p (responsive, accessible, dark-mode friendly, gradient highlight) */}
<header className="text-center">
<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-slate-900 dark:text-white">
Everything you need to stay organized
<span className="block mt-3 text-2xl sm:text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
Bookmarks, Collections & Lightning Search
</span>
</h1>


<p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
Powerful features designed to transform your chaotic bookmark collection into an organized, searchable library — AI categorization, keyboard-first search (CMD/CTRL+K), end-to-end privacy, and effortless sharing across devices.
</p>
</header>


{/* Features grid */}
<div className='py-20 px-4 sm:px-6 md:px-8 lg:px-30'>
<BentoGrid className="lg:grid-rows-3">
{features.map((feature) => (
<BentoCard key={feature.name} {...feature} />
))}
</BentoGrid>
</div>
</div>
</section>
)
}


export default Features