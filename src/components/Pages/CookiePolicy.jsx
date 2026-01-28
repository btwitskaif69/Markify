"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from "../SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { formatDateUTC } from "@/lib/date";

const CookiePolicy = () => {
    const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Cookie Policy", path: "/cookies" },
    ]);
    return (
        <>
            <SEO
                title="Bookmark Manager Cookie Policy"
                description="Understand how Markify uses cookies for analytics, preferences, and performance in the bookmark manager."
                canonical={getCanonicalUrl("/cookies")}
                structuredData={breadcrumbs ? [breadcrumbs] : null}
            />
            <Navbar />
            <main className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-foreground">Cookie Policy</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p className="mb-4">Last updated: {formatDateUTC(new Date())}</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. What Are Cookies</h2>
                            <p>
                                Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                                For more details on how we protect your data, please refer to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How Markify Uses Cookies</h2>
                            <p>
                                When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, to enable advertisements delivery, including behavioral advertising.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Third-Party Cookies</h2>
                            <p>
                                In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Your Choices Regarding Cookies</h2>
                            <p>
                                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                                You can also manage your preferences on our <Link href="/cookie-settings" className="text-primary hover:underline">Cookie Settings</Link> page.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Contact Us</h2>
                            <p>
                                If you have any questions about our use of cookies, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                                You can also check our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> for more information about using our website.
                            </p>
                        </section>

                        <section className="mb-8 p-4 border border-border rounded-lg bg-card/50">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Related Pages</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> - How we protect your data
                                </li>
                                <li>
                                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> - Our rules and regulations
                                </li>
                                <li>
                                    <Link href="/cookie-settings" className="text-primary hover:underline">Cookie Settings</Link> - Manage your preferences
                                </li>
                                <li>
                                    <Link href="/about" className="text-primary hover:underline">About Us</Link> - Learn more about Markify
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

export default CookiePolicy;
