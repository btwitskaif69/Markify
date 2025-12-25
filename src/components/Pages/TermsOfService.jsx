import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from "../SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

const TermsOfService = () => {
    const breadcrumbs = buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Terms of Service", path: "/terms" },
    ]);
    return (
        <>
            <SEO
                title="Terms of Service"
                description="Markify Terms of Service - Read our terms and conditions for using our services."
                canonical={getCanonicalUrl("/terms")}
                structuredData={breadcrumbs ? [breadcrumbs] : null}
            />
            <Navbar />
            <main className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Agreement to Terms</h2>
                            <p>
                                By accessing our website at <Link to="/" className="text-primary hover:underline">Markify</Link>, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. By using our service, you also agree to our{' '}
                                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on Markify's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>modify or copy the materials;</li>
                                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>attempt to decompile or reverse engineer any software contained on Markify's website;</li>
                                <li>remove any copyright or other proprietary notations from the materials; or</li>
                                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Disclaimer</h2>
                            <p>
                                The materials on Markify's website are provided on an 'as is' basis. Markify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitations</h2>
                            <p>
                                In no event shall Markify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Markify's website, even if Markify or a Markify authorized representative has been notified orally or in writing of the possibility of such damage. For information about refunds, please see our{' '}
                                <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms of Service, please{' '}
                                <Link to="/contact" className="text-primary hover:underline">contact us</Link>. You can learn more about our service on our{' '}
                                <Link to="/about" className="text-primary hover:underline">About page</Link>, or explore our{' '}
                                <Link to="/pricing" className="text-primary hover:underline">pricing plans</Link>.
                            </p>
                        </section>

                        <section className="mb-8 p-4 border border-border rounded-lg bg-card/50">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Related Pages</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> - How we handle your personal data
                                </li>
                                <li>
                                    <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> - Information about our cookie usage
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> - Our refund and cancellation terms
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

export default TermsOfService;
