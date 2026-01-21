import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ScrollArea } from "@/components/ui/scroll-area";
import SEO from "../SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

const PrivacyPolicy = () => {
    const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy" },
    ]);
    return (
        <>
            <SEO
                title="Privacy Policy for Bookmark Manager Users"
                description="Learn how Markify collects, uses, and protects personal data when you use the bookmark manager and related services."
                canonical={getCanonicalUrl("/privacy")}
                structuredData={breadcrumbs ? [breadcrumbs] : null}
            />
            <Navbar />
            <main className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                            <p>
                                Welcome to <Link to="/" className="text-primary hover:underline">Markify</Link>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                Please also review our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> to understand how we use cookies.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Data We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please <Link to="/contact" className="text-primary hover:underline">contact us</Link> or check our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                            </p>
                        </section>

                        <section className="mb-8 p-4 border border-border rounded-lg bg-card/50">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Related Pages</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> - Our rules and regulations
                                </li>
                                <li>
                                    <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> - How we use cookies
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> - Our refund guidelines
                                </li>
                                <li>
                                    <Link to="/about" className="text-primary hover:underline">About Us</Link> - Learn more about Markify
                                </li>
                            </ul>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
