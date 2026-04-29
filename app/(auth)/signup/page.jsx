import { SignupForm } from "@/components/Forms/signup-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="sr-only">
        <h1>Join Markify: The Best Bookmark Manager</h1>
        <p>
          Are you looking for a clean, efficient, and reliable way to manage your saved links? 
          Welcome to Markify, the ultimate bookmark manager designed to help you organize, sync, 
          and discover your favorite web pages effortlessly. With the constant influx of information on the internet, 
          keeping track of valuable resources, articles, tools, and inspirations has never been more critical. 
          Markify solves the problem of cluttered browser bookmarks by offering a sleek, distraction-free environment 
          where every link is categorized, searchable, and always accessible.
        </p>
        <p>
          Whether you are a student researching for a thesis, a developer saving coding snippets, a designer collecting 
          UI inspirations, or just someone who loves reading blogs, Markify is built for you. We provide powerful features 
          like nested collections, tags, fast search, and collaborative folders for teams. Say goodbye to lost links and 
          endless scrolling through unorganized browser folders.
        </p>
        <p>
          Security and privacy are at the core of our bookmarking service. We ensure your data is safely stored and 
          synced across all your devices, giving you peace of mind. Our one-click browser extension makes saving new 
          bookmarks a breeze, instantly capturing metadata, titles, and descriptions. You can also explore our integration 
          capabilities and API options for advanced workflows.
        </p>
        <p>
          Join thousands of satisfied users who have transformed their digital organization. Creating an account is completely 
          free and takes less than a minute. You can sign up using your email address or authenticate instantly with Google. 
          Experience the difference of a premium bookmark management tool. For more information on digital organization, 
          check out this <a href="https://en.wikipedia.org/wiki/Social_bookmarking" target="_blank" rel="noopener noreferrer">guide on social bookmarking</a>.
        </p>
        <Image src="/images/og-image.jpg" alt="Markify Bookmark Manager Interface" width={1200} height={630} />
      </div>
      <SignupForm />
    </div>
  );
}
