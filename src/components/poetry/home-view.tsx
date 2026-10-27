"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Feather,
  Heart,
  Library,
  PenLine,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import type { Poem } from "@/types/poem";
import { CATEGORIES, CATEGORY_MAP } from "@/data/poems";
import { cn } from "@/lib/utils";

interface HomeViewProps {
  poemOfTheDay: Poem;
  totalPoems: number;
  favoritesCount: number;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onOpenPoem: (poem: Poem) => void;
  onBrowse: () => void;
  onSubmit: () => void;
  onGoToFavorites: () => void;
  onPickCategory: (categoryId: string) => void;
}

export function HomeView({
  poemOfTheDay,
  totalPoems,
  favoritesCount,
  isFavorite,
  onToggleFavorite,
  onOpenPoem,
  onBrowse,
  onSubmit,
  onGoToFavorites,
  onPickCategory,
}: HomeViewProps) {
  const cat = CATEGORY_MAP[poemOfTheDay.category];
  const liked = isFavorite(poemOfTheDay.id);
  const [heartAnimating, setHeartAnimating] = React.useState(false);

  const handleHeart = () => {
    if (!liked) {
      setHeartAnimating(true);
      window.setTimeout(() => setHeartAnimating(false), 750);
    }
    onToggleFavorite(poemOfTheDay.id);
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative">
        {/* Ornements décoratifs flottants */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="float-soft pointer-events-none absolute -left-4 top-12 hidden text-rose/40 lg:block"
        >
          <Feather className="h-10 w-10 rotate-12" strokeWidth={1.2} />
        </motion.div>
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="float-soft pointer-events-none absolute -right-4 top-32 hidden text-gold/50 lg:block"
          style={{ animationDelay: "1.5s" }}
        >
          <Sparkles className="h-8 w-8" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
            Recueil de poésie d'amour
          </motion.span>

          <h1 className="mt-7 font-serif text-6xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl md:text-8xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block"
            >
              Vers lents,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="block text-gradient-romantic italic"
            >
              lents matins
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="block"
            >
              .
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Un recueil vivant où s'entrelacent passion, douceur et nostalgie.
            Lisez, gardez, offrez — et venez y déposer vos propres vers, pour
            que d'autres les découvrent un jour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={onBrowse}
              className="btn-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Library className="h-4 w-4" strokeWidth={2} />
              Parcourir le recueil
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-8 text-sm font-medium backdrop-blur-md transition-all hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <PenLine className="h-4 w-4" strokeWidth={2} />
              Offrir un poème
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="ornament-divider mt-12 text-xs uppercase tracking-[0.25em] text-muted-foreground"
          >
            <span aria-hidden>✦</span>
            <span className="font-serif italic normal-case tracking-normal">
              {totalPoems} vers réunis pour vous
            </span>
            <span aria-hidden>✦</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ POÈME DU JOUR ═══════════════ */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-gold">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              À lire aujourd'hui
            </p>
            <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Le poème du jour
            </h2>
          </div>
          <span className="hidden font-serif text-sm italic text-muted-foreground sm:block">
            renouvelé chaque matin
          </span>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="gold-frame shine-on-hover relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-8 shadow-xl shadow-primary/10 sm:p-12 lg:p-14"
        >
          {/* Décor d'arrière-plan : halos colorés */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-rose/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><path d='M20 5l3 12 12 3-12 3-3 12-3-12-12-3 12-3z' fill='none' stroke='%23a83232' stroke-width='0.5'/></svg>\")",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative">
            {/* Catégorie + badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
                <span aria-hidden>{cat?.glyph}</span>
                {cat?.label}
              </span>
              {poemOfTheDay.isSubmission ? (
                <span className="rounded-full bg-rose/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose">
                  Communauté
                </span>
              ) : null}
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-gold">
                <Star className="h-3 w-3 fill-gold" strokeWidth={2} />
                <span className="font-medium uppercase tracking-wider">
                  À la une
                </span>
              </span>
            </div>

            {/* Titre */}
            <h3 className="mt-7 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              {poemOfTheDay.title}
            </h3>

            {/* Auteur */}
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-muted-foreground sm:text-base">
              <span className="italic">par</span>
              <span className="font-medium text-foreground/80">
                {poemOfTheDay.author}
              </span>
              {poemOfTheDay.year ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{poemOfTheDay.year}</span>
                </>
              ) : null}
            </div>

            {/* Dédicace */}
            {poemOfTheDay.dedication ? (
              <p className="mt-4 font-serif text-lg italic text-rose/90 sm:text-xl">
                « {poemOfTheDay.dedication} »
              </p>
            ) : null}

            {/* Ornement décoratif */}
            <div className="ornament-divider my-8 text-gold">
              <span aria-hidden className="text-lg">
                ❦
              </span>
            </div>

            {/* Vers */}
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="relative pl-7">
                <Quote
                  aria-hidden
                  className="absolute left-0 top-1 h-5 w-5 text-primary/40"
                  strokeWidth={2}
                />
                <div className="space-y-1 font-serif text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {poemOfTheDay.verses
                    .filter((v) => v.trim() !== "")
                    .slice(0, 4)
                    .map((v, i) => (
                      <p key={i}>{v}</p>
                    ))}
                </div>
                <p className="mt-3 text-xs italic text-muted-foreground/70">
                  [extrait du poème]
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <button
                  type="button"
                  onClick={() => onOpenPoem(poemOfTheDay)}
                  className="btn-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Lire en entier
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={handleHeart}
                  aria-pressed={liked}
                  aria-label={
                    liked ? "Retirer des favoris" : "Ajouter aux favoris"
                  }
                  className={cn(
                    "inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    liked
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-transform",
                      liked && "fill-primary text-primary",
                      heartAnimating && "animate-heart-beat",
                    )}
                    strokeWidth={2}
                  />
                  {liked ? "Dans vos favoris" : "J'aime"}
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </section>

      {/* ═══════════════ CATÉGORIES ═══════════════ */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            Explorer par teinte
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
            Les catégories
          </h2>
          <p className="mt-3 max-w-prose text-sm text-muted-foreground sm:text-base">
            Chaque émotion a sa couleur, chaque couleur son vers. Choisissez
            celle qui vous ressemble aujourd'hui, et laissez-vous porter.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onPickCategory(cat.id)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="shine-on-hover group relative overflow-hidden rounded-2xl border border-border bg-card p-7 text-left shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* Halo coloré */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100",
                  cat.accent === "bordeaux" && "bg-primary/20",
                  cat.accent === "rose" && "bg-rose/25",
                  cat.accent === "gold" && "bg-gold/25",
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full blur-3xl opacity-30 transition-opacity duration-700 group-hover:opacity-60",
                  cat.accent === "bordeaux" && "bg-bordeaux/30",
                  cat.accent === "rose" && "bg-rose/30",
                  cat.accent === "gold" && "bg-gold/30",
                )}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-4xl" aria-hidden>
                    {cat.glyph}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary opacity-70 transition-opacity group-hover:opacity-100">
                  Découvrir
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ═══════════════ APPEL À L'ÉCRITURE ═══════════════ */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="gold-frame relative overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-card via-background to-secondary/40 p-10 text-center shadow-lg sm:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><circle cx='30' cy='30' r='1' fill='%23a83232'/></svg>\")",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative mx-auto max-w-xl">
            <div className="ornament-divider mb-6 text-gold">
              <PenLine className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Vous portez en vous quelques vers ?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Offrez-les au recueil. Vos mots rejoindront ceux des autres,
              peut-être lus un soir, par quelqu'un qui en avait besoin.
            </p>
            <button
              type="button"
              onClick={onSubmit}
              className="btn-gradient mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Feather className="h-4 w-4" strokeWidth={2} />
              Écrire un poème
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
