"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HeartCrack, Heart, Trash2 } from "lucide-react";
import type { Poem } from "@/types/poem";
import { PoemCard } from "./poem-card";

interface FavoritesViewProps {
  poems: Poem[];
  isFavorite: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPoem: (poem: Poem) => void;
  onBrowse: () => void;
  onClear: () => void;
}

export function FavoritesView({
  poems,
  isFavorite,
  onToggleFavorite,
  onOpenPoem,
  onBrowse,
  onClear,
}: FavoritesViewProps) {
  if (poems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-xl"
      >
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 py-16 text-center">
          <HeartCrack
            className="h-12 w-12 text-muted-foreground/60"
            strokeWidth={1.5}
          />
          <p className="mt-5 font-serif text-2xl font-semibold text-foreground">
            Vos favoris attendent
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Touchez le cœur sur un poème pour le garder ici. Vous pourrez le
            relire à tout moment, même sans connexion.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20"
          >
            <Heart className="h-4 w-4" strokeWidth={2} />
            Parcourir le recueil
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Votre cœur de papier
          </p>
          <h1 className="mt-1 font-serif text-4xl font-semibold sm:text-5xl">
            Favoris
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
            {poems.length} poème{poems.length > 1 ? "s" : ""} gardé
            {poems.length > 1 ? "s" : ""} précieusement. Sauvegardé localement
            sur cet appareil.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          Tout retirer
        </button>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {poems.map((poem, i) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            index={i}
            isFavorite={isFavorite(poem.id)}
            onToggleFavorite={onToggleFavorite}
            onOpen={onOpenPoem}
            variant="featured"
          />
        ))}
      </div>
    </div>
  );
}
