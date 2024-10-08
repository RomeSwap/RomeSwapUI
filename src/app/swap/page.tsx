"use client";

import { Suspense } from "react";
import SwapClient from "./swap-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SwapPage() {
  return (
    <Suspense>
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <SwapClient />
        <ToastContainer theme="dark" />
      </div>
    </Suspense>
  );
}
