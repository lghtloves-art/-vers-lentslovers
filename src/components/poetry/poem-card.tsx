"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Heart, Quote } from "lucide-react";
import type { Poem } from "@/types/poem";
import { CATEGORY_MAP } from "@/data/poems";
import { getReadingTime } from "@/lib/poem-utils";
import { cn } from "@/lib/utils";

interface PoemCardProps {
  poem: Poem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (poem: Poem) => void;
  variant?: "default" | "featured";
  index?: number;
}

export function PoemCard({
  poem,
  isFavorite,
  onToggleFavorite,
  onOpen,
  variant = "default",
  index = 0,
}: PoemCardProps) {
  const category = CATEGORY_MAP[poem.category];
  const [heartAnimating, setHeartAnimating] = React.useState(false);
  const readingTime = React.useMemo(() => getReadingTime(poem), [poem]);

  const preview = poem.verses.filter((v) => v.trim() !== "").slice(0, 2);

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFavorite) {
      setHeartAnimating(true);
      window.setTimeout(() => setHeartAnimating(false), 750);
    }
    onToggleFavorite(poem.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(poem);
    }
  };

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir le poème ${poem.title} de ${poem.author}`}
      onClick={() => onOpen(poem)}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className={cn(
        "shine-on-hover group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7",
        "shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "featured" && "gold-frame",
      )}
    >
      {/* Halo coloré au survol */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          category?.accent === "bordeaux" && "bg-primary/15",
          category?.accent === "rose" && "bg-rose/20",
          category?.accent === "gold" && "bg-gold/20",
        )}
      />

      {/* Marque de chapitre en haut à droite */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-5 font-serif text-3xl text-foreground/[0.04] transition-colors group-hover:text-foreground/[0.07]"
      >
        ❦
      </span>

      {/* En-tête : catégorie + temps de lecture */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
          <span aria-hidden>{category?.glyph}</span>
          {category?.label}
        </span>
        {poem.isSubmission && (
          <span className="rounded-full bg-rose/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose">
            Communauté
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
        {poem.title}
      </h3>

      {/* Auteur + temps de lecture */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <span className="italic">par</span>
        <span className="font-medium text-foreground/80">{poem.author}</span>
        {poem.year ? (
          <>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{poem.year}</span>
          </>
        ) : null}
        <span aria-hidden className="text-border">·</span>
        <span className="inline-flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" strokeWidth={2} />
          <span className="tabular-nums">{readingTime.minutes} min</span>
        </span>
      </div>

      {/* Dédicace */}
      {poem.dedication ? (
        <p className="mt-3 font-serif text-sm italic text-rose/80">
          « {poem.dedication} »
        </p>
      ) : null}

      {/* Séparateur fin */}
      <div
        aria-hidden
        className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
      />

      {/* Aperçu du poème */}
      <div className="relative mt-5 pl-5">
        <Quote
          aria-hidden
          className="absolute left-0 top-0 h-4 w-4 text-primary/30"
          strokeWidth={2}
        />
        <p className="font-serif text-[15px] leading-relaxed text-muted-foreground">
          {preview[0]}
          {preview[1] ? <br /> : null}
          {preview[1]}
        </p>
      </div>

      {/* Pied : actions */}
      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/80 transition-colors group-hover:text-primary">
          Lire le poème
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>

        <button
          type="button"
          onClick={handleHeart}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Retirer ${poem.title} des favoris`
              : `Ajouter ${poem.title} aux favoris`
          }
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isFavorite
              ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/20"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary hover:scale-105",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-transform",
              isFavorite && "fill-primary text-primary",
              heartAnimating && "animate-heart-beat",
            )}
            strokeWidth={2}
          />
        </button>
      </div>
    </motion.article>
  );
}
