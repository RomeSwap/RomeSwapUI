"use client";

import { Suspense } from "react";
import SwapClient from "./swap-client";
import { Toaster } from "react-hot-toast";

export default function SwapPage() {
  return (
    <Suspense>
      <SwapClient />
      <Toaster position="bottom-right" />
    </Suspense>
  );
}
