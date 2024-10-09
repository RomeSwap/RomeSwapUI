"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";

const BgEllipseSvgs = () => {
  const pathname = usePathname();
  const isHome = () => {
    if (pathname === "/") {
      return true;
    }
  };
  return (
    <div
      className={clsx("pointer-events-none flex items-center justify-center")}
    >
      {/* Top */}
      <div className="hidden lg:block absolute -top-[600px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(20,241,149,0.24)] rounded-full blur-[200px]"></div>
      {/* Right */}
      <div
        className={clsx(
          "absolute -bottom-[150px] lg:-bottom-[300px] -right-0 w-[200px] lg:w-[300px] h-[400px] lg:h-[600px] bg-[rgba(20,241,149,0.24)] rounded-l-full blur-[100px] lg:blur-[200px]",
          isHome() ? "" : "lg:bottom-0 lg:h-[300px] rounded-bl-lg",
        )}
      ></div>
    </div>
  );
};

export default BgEllipseSvgs;
