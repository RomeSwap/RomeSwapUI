"use client";

import { useState } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";

import { motion } from "framer-motion";

const RefreshBtn = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <motion.button
      type="button"
      className="flex items-center justify-center text-primary"
      onClick={handleClick}
      whileTap={{ scale: 0.8 }}
    >
      <motion.div
        className="text-lg lg:text-xl"
        animate={{
          rotate: isAnimating ? 360 : 0,
        }}
        transition={{
          duration: 1,
          ease: "linear",
        }}
      >
        <FaArrowRotateLeft />
      </motion.div>
    </motion.button>
  );
};

export default RefreshBtn;
