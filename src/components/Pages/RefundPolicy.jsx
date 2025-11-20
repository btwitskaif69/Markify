import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Refund Policy</h1>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Overview</h2>
                        <p>
                            At Markify, we strive to ensure our customers are satisfied with our services. If you are not entirely satisfied with your purchase, we're here to help.
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
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. How to Request a Refund</h2>
                        <p>
                            To request a refund, please contact our support team at support@markify.tech with your order details and the reason for your request. We will review your request and notify you of the approval or rejection of your refund.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Processing Time</h2>
                        <p>
                            If your refund is approved, it will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
