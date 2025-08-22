import React from 'react'
import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";
import bg from '@/assets/global-search.png'
 
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
 
const features = [
  {
    Icon: FileTextIcon,
    name: "Smart Auto-Organization",
    description: "AI-powered categorization that learns from your browsing habits and automatically sorts bookmarks into intelligent collections.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute top-10 object-cover [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Lightning-Fast Global Search",
    description: "Find any bookmark in milliseconds with our advanced CMD+K or CTRL+K search that understands context, tags, and content.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute scale-170 duration-300 brightness-150 contrast-125 hover:scale-180 ease-in-out [--duration:20s]
                                        [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)]" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Privacy-First Design",
    description: "Your bookmarks stay yours. End-to-end encryption ensures your browsing history remains completely private.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Universal Sync",
    description: "Access your bookmarks anywhere, anytime. Seamless synchronization across all your devices and browsers.",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Shareable Bookmarks",
    description:
      "Share Bookmarks with your team and friends in one click",
    href: "/",
    cta: "Learn more",
    background: <img src={bg} className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

const Features = () => {
  return (
    <div className='py-20 px-4 sm:px-6 md:px-8 lg:px-30'>
       <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
    </div>
  )
}

export default Features