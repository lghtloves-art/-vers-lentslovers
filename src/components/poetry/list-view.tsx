"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Filter, Heart, Shuffle } from "lucide-react";
import type { CategoryId, Poem } from "@/types/poem";
import { CATEGORIES } from "@/data/poems";
import { PoemCard } from "./poem-card";
import { SearchBar } from "./search-bar";
import { CategoryFilter } from "./category-filter";
import { cn } from "@/lib/utils";

type SortOption = "recent" | "alpha" | "year-desc" | "year-asc";

interface ListViewProps {
  poems: Poem[];
  isFavorite: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPoem: (poem: Poem) => void;
  initialCategory?: CategoryId | "all";
  onRandomPoem?: () => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Récents",
  alpha: "A → Z",
  "year-desc": "Années ↓",
  "year-asc": "Années ↑",
};

export function ListView({
  poems,
  isFavorite,
  onToggleFavorite,
  onOpenPoem,
  initialCategory = "all",
  onRandomPoem,
}: ListViewProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<CategoryId | "all">(
    initialCategory,
  );
  const [sort, setSort] = React.useState<SortOption>("recent");

  React.useEffect(() => {
    setSelected(initialCategory);
  }, [initialCategory]);

  // Compteurs par catégorie (sur l'ensemble, sans filtre de recherche)
  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: poems.length };
    for (const cat of CATEGORIES) c[cat.id] = 0;
    for (const p of poems) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [poems]);

  // Filtrage
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = poems.filter((p) => {
      if (selected !== "all" && p.category !== selected) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.author,
        p.dedication ?? "",
        p.verses.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    // Tri
    const sorted = [...result];
    switch (sort) {
      case "alpha":
        sorted.sort((a, b) =>
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" }),
        );
        break;
      case "year-desc":
        sorted.sort(
          (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "fr"),
        );
        break;
      case "year-asc":
        sorted.sort(
          (a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title, "fr"),
        );
        break;
      case "recent":
      default:
        // Récents = soumissions d'abord (par createdAt desc), puis par ordre du recueil
        sorted.sort((a, b) => {
          if (a.isSubmission && !b.isSubmission) return -1;
          if (!a.isSubmission && b.isSubmission) return 1;
          if (a.isSubmission && b.isSubmission) {
            return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
          }
          return 0;
        });
        break;
    }
    return sorted;
  }, [poems, query, selected, sort]);

  return (
    <div className="space-y-6">
      <header className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
              Le recueil
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Tous les poèmes
            </h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
              Parcourez les vers par catégorie, ou cherchez un mot, une image,
              un nom d'auteur. Chaque poème s'ouvre dans une lecture immersive.
            </p>
          </div>

          {onRandomPoem ? (
            <button
              type="button"
              onClick={onRandomPoem}
              className="btn-gradient inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Shuffle className="h-4 w-4" strokeWidth={2} />
              <span className="hidden sm:inline">Au hasard</span>
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <SearchBar value={query} onChange={setQuery} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 hidden shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex">
                <Filter className="h-3.5 w-3.5" strokeWidth={2} />
                Filtrer :
              </span>
              <CategoryFilter
                selected={selected}
                onChange={setSelected}
                counts={counts}
              />
            </div>

            {/* Tri */}
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/70 p-1 backdrop-blur">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSort(opt)}
                  className={cn(
                    "relative rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    sort === opt
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {sort === opt ? (
                    <motion.span
                      layoutId="sort-active"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  ) : null}
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Compteur de résultats */}
      <div className="flex items-baseline justify-between border-t border-border/70 pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          poème{filtered.length > 1 ? "s" : ""}
          {selected !== "all" ? " dans cette catégorie" : " au total"}
          {query ? <> pour « {query} »</> : null}
        </p>
      </div>

      {/* Grille */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 py-16 text-center"
          >
            <BookOpen
              className="h-10 w-10 text-muted-foreground/60"
              strokeWidth={1.5}
            />
            <p className="mt-4 font-serif text-xl text-foreground">
              Aucun poème trouvé
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Essayez un autre mot-clé, ou changez de catégorie. Vous pouvez
              aussi offrir le vôtre.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelected("all");
              }}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={2} />
              Réinitialiser
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((poem, i) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                index={i}
                isFavorite={isFavorite(poem.id)}
                onToggleFavorite={onToggleFavorite}
                onOpen={onOpenPoem}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
