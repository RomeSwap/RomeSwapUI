"use client";

import { Suspense } from "react";
import SwapClient from "./swap-client";
import { Toaster } from "react-hot-toast";

export default function SwapPage() {
  return (
    <Suspense>
      <div className="min-h-screen w-full flex flex-col justify-center">
        <SwapClient />
        <Toaster position="bottom-right" />
      </div>
    </Suspense>
  );
}
