"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, History } from "lucide-react";
import type { Poem } from "@/types/poem";
import { CATEGORY_MAP } from "@/data/poems";
import { getReadingTime } from "@/lib/poem-utils";

interface ContinueReadingProps {
  poem: Poem | null;
  isFavorite: boolean;
  onOpen: (poem: Poem) => void;
  onDismiss: () => void;
}

export function ContinueReading({
  poem,
  isFavorite,
  onOpen,
  onDismiss,
}: ContinueReadingProps) {
  if (!poem) return null;

  const category = CATEGORY_MAP[poem.category];
  const readingTime = getReadingTime(poem);
  const preview = poem.verses.filter((v) => v.trim() !== "").slice(0, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <motion.button
        type="button"
        onClick={() => onOpen(poem)}
        whileHover={{ y: -3 }}
        className="shine-on-hover group relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-rose/5 p-5 text-left shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6"
      >
        <div className="flex items-center gap-4">
          {/* Icône d'historique */}
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
            <History className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">
              <History className="h-3 w-3 sm:hidden" strokeWidth={2} />
              Reprendre la lecture
            </p>
            <h3 className="mt-1 line-clamp-1 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {poem.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
              <span className="font-medium text-foreground/70">
                {poem.author}
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" strokeWidth={2} />
                <span className="tabular-nums">{readingTime.minutes} min</span>
              </span>
              <span aria-hidden>·</span>
              <span aria-hidden>{category?.glyph}</span>
              <span>{category?.label}</span>
            </div>
            <p className="mt-2 line-clamp-1 font-serif text-sm italic text-muted-foreground">
              {preview[0]}
            </p>
          </div>

          {/* Action */}
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-transform group-hover:translate-x-0.5 sm:inline-flex">
              Continuer
              <ArrowRight className="h-3 w-3" strokeWidth={2} />
            </span>
            <ArrowRight className="h-4 w-4 text-primary sm:hidden" strokeWidth={2} />
          </div>
        </div>
      </motion.button>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-muted-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          ne pas afficher
        </button>
      </div>
    </motion.section>
  );
}
