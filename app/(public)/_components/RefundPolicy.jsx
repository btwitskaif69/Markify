"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatDateUTC } from "@/lib/date";

const RefundPolicy = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-foreground">Refund Policy</h1>
                    <div className="prose prose-invert max-w-none text-muted-foreground">
                        <p className="mb-4">Last updated: {formatDateUTC(new Date())}</p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Overview</h2>
                            <p>
                                At <Link href="/" className="text-primary hover:underline">Markify</Link>, we strive to ensure our customers are satisfied with our services. If you are not entirely satisfied with your purchase, we're here to help. Please review our{' '}
                                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> for additional information about your rights and obligations.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Eligibility for Refunds</h2>
                            <p>
                                You may be eligible for a refund under the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>You request a refund within 14 days of your initial purchase.</li>
                                <li>You have encountered a technical issue that we are unable to resolve.</li>
                                <li>You were charged in error.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Non-refundable Items</h2>
                            <p>
                                Certain items or services are non-refundable, including:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Services that have already been fully rendered.</li>
                                <li>Subscription renewals (unless cancelled prior to the renewal date).</li>
                            </ul>
                            <p className="mt-4">
                                To learn more about our subscription plans, visit our{' '}
                                <Link href="/pricing" className="text-primary hover:underline">pricing page</Link>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. How to Request a Refund</h2>
                            <p>
                                To request a refund, please{' '}
                                <Link href="/contact" className="text-primary hover:underline">contact our support team</Link> or send an email to{' '}
                                <a href="mailto:support@markify.tech" className="text-primary hover:underline">support@markify.tech</a>{' '}
                                with your order details and the reason for your request. We will review your request and notify you of the approval or rejection of your refund.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Processing Time</h2>
                            <p>
                                If your refund is approved, it will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                            </p>
                        </section>

                        <section className="mb-8 p-4 border border-border rounded-lg bg-card/50">
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Related Pages</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> - Our complete terms and conditions
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> - How we protect your data
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-primary hover:underline">Pricing</Link> - View our subscription plans
                                </li>
                                <li>
                                    <Link href="/contact" className="text-primary hover:underline">Contact Us</Link> - Get in touch with our support team
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

export default RefundPolicy;
