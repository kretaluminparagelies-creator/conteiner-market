/**
 * @file CategoryCardMotion.tsx
 * @description Layer C — Motion stagger, hover lift, reduced-motion safe
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const categoryCardMotionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const categoryGridMotionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

type CategoryCardMotionProps = {
  children: ReactNode;
  className?: string;
};

export function CategoryCardMotion({ children, className }: CategoryCardMotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={categoryCardMotionVariants}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -10,
              scale: 1.02,
              transition: { duration: 0.25, ease: "easeOut" },
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.98,
              transition: { duration: 0.12 },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

type CategoryGridMotionProps = {
  children: ReactNode;
  className?: string;
};

export function CategoryGridMotion({ children, className }: CategoryGridMotionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={categoryGridMotionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
