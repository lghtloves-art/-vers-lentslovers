"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Barre de progression de lecture fixée en haut de la fenêtre.
 * Suit la position de scroll du conteneur cible (par défaut la fenêtre).
 */
export function ReadingProgress({
  targetRef,
}: {
  targetRef?: React.RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef ?? undefined,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-primary via-rose to-gold"
    />
  );
}
