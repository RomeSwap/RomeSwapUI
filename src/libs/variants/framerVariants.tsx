export const mobileMenuVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const mobileMenuChildrenVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const fadeIn = (
  direction: string,
  delay: number,
  duration: number = 1.5,
) => {
  return {
    hidden: {
      y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
      opacity: 0,
      x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
      transition: {
        type: "tween",
        duration: 1.5,
        delay: delay,
        ease: [0.25, 0.6, 0.3, 0.8],
      },
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: duration,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const inViewVars = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};
