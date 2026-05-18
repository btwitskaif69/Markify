"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import PricingPlans from "@/components/home/PricingPlans";

const PricingPage = () => {
  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground relative overflow-hidden">



        <div className="relative z-20 pt-8 pb-16">
          <PricingPlans />
          
          <div className="text-center text-sm text-muted-foreground pb-8">
            Need a custom plan or have questions?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
            .
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PricingPage;
