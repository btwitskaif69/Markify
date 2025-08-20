import React from "react";

// Import logos
import Logo1 from "@/assets/1.svg";
import Logo2 from "@/assets/2.svg";
import Logo3 from "@/assets/3.svg";
import Logo4 from "@/assets/4.svg";
import Logo5 from "@/assets/5.svg";
import Logo6 from "@/assets/6.svg";
import Logo7 from "@/assets/7.svg";
import Logo8 from "@/assets/8.svg";

const logos = [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8];

const PowerBy = () => {
  return (
    <section className="w-full py-10 bg-black">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-white text-lg font-medium mb-6">
          Powered by the best:
        </h2>

        {/* Logos Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              className="h-8 opacity-70 hover:opacity-100 transition filter-greyscale"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PowerBy;
