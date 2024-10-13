"use client";

import { Suspense } from "react";
import SwapClient from "./swap-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { fadeIn } from "@/libs/variants/framerVariants";

export default function SwapPage() {
  return (
    <Suspense>
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <motion.div
          className="absolute top-0 rotate-0 w-full h-full flex flex-col items-center justify-center"
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          animate="show"
        >
          <SwapClient />
        </motion.div>
        <ToastContainer theme="dark" />
      </div>
    </Suspense>
  );
}
