"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Heart,
  PenLine,
  Share2,
} from "lucide-react";
import type { Poem } from "@/types/poem";
import { CATEGORY_MAP } from "@/data/poems";
import { getReadingTime } from "@/lib/poem-utils";
import { cn } from "@/lib/utils";

interface PoemReaderProps {
  poem: Poem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onNavigate?: (poem: Poem) => void;
  siblings?: { prev?: Poem; next?: Poem };
}

export function PoemReader({
  poem,
  isFavorite,
  onToggleFavorite,
  onClose,
  onNavigate,
  siblings,
}: PoemReaderProps) {
  const category = CATEGORY_MAP[poem.category];
  const [copied, setCopied] = React.useState(false);
  const [heartAnimating, setHeartAnimating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const readingTime = React.useMemo(() => getReadingTime(poem), [poem]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setProgress(0);
  }, [poem.id]);

  // Suivi de progression de lecture
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      if (max <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.min(1, Math.max(0, scrollTop / max)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [poem.id]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && siblings?.prev) onNavigate?.(siblings.prev);
      if (e.key === "ArrowRight" && siblings?.next) onNavigate?.(siblings.next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, siblings]);

  const handleCopy = async () => {
    const text = [
      poem.title,
      `— ${poem.author}${poem.year ? `, ${poem.year}` : ""}`,
      "",
      ...poem.verses,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        // ignore
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: poem.title,
      text: `${poem.title}\n— ${poem.author}\n\n${poem.verses.filter((v) => v.trim()).join("\n")}`,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Annulé par l'utilisateur
      }
    } else {
      handleCopy();
    }
  };

  const handleHeart = () => {
    if (!isFavorite) {
      setHeartAnimating(true);
      window.setTimeout(() => setHeartAnimating(false), 750);
    }
    onToggleFavorite(poem.id);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={poem.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col"
      >
        {/* Fond avec halos colorés */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-background" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 15% 15%, color-mix(in oklch, var(--rose) 25%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 85% 85%, color-mix(in oklch, var(--gold) 18%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 50% 50%, color-mix(in oklch, var(--bordeaux) 10%, transparent) 0%, transparent 60%)
            `,
          }}
        />

        {/* Barre de progression de lecture */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-20 h-1 bg-border/30"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-rose to-gold"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Barre supérieure glass */}
        <header className="glass sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Retour</span>
          </button>

          {/* Indicateur de progression central */}
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Clock className="h-3 w-3" strokeWidth={2} />
            <span className="tabular-nums">{readingTime.minutes} min</span>
            <span aria-hidden className="text-border">·</span>
            <span className="tabular-nums">
              {Math.round(progress * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ReaderAction
              label="Partager le poème"
              onClick={handleShare}
              icon={<Share2 className="h-4 w-4" strokeWidth={2} />}
            />
            <ReaderAction
              label="Copier le poème"
              onClick={handleCopy}
              icon={
                copied ? (
                  <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                ) : (
                  <Copy className="h-4 w-4" strokeWidth={2} />
                )
              }
              active={copied}
            />
            <ReaderAction
              label={
                isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
              }
              onClick={handleHeart}
              icon={
                <Heart
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isFavorite && "fill-primary text-primary",
                    heartAnimating && "animate-heart-beat",
                  )}
                  strokeWidth={2}
                />
              }
              active={isFavorite}
            />
          </div>
        </header>

        {/* Corps : lecture immersive */}
        <div ref={scrollRef} className="poetic-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
            {/* Catégorie */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-6 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold"
            >
              <span aria-hidden>{category?.glyph}</span>
              <span>{category?.label}</span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-center font-serif text-5xl font-semibold leading-tight text-foreground sm:text-6xl"
            >
              {poem.title}
            </motion.h1>

            {/* Auteur + meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground sm:text-base"
            >
              <span className="inline-flex items-baseline gap-2">
                <span className="italic">par</span>
                <span className="font-medium text-foreground/80">
                  {poem.author}
                </span>
              </span>
              {poem.year ? (
                <>
                  <span aria-hidden className="text-border">·</span>
                  <span className="tabular-nums">{poem.year}</span>
                </>
              ) : null}
              <span aria-hidden className="text-border">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" strokeWidth={2} />
                <span className="tabular-nums">{readingTime.minutes} min</span>
              </span>
            </motion.div>

            {/* Dédicace */}
            {poem.dedication ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="mt-5 text-center font-serif text-lg italic text-rose/90 sm:text-xl"
              >
                « {poem.dedication} »
              </motion.p>
            ) : null}

            {/* Ornement décoratif */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="ornament-divider mt-10 text-gold"
            >
              <span aria-hidden className="text-xl">
                ❦
              </span>
            </motion.div>

            {/* Vers */}
            <motion.article
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="mt-12 space-y-5 font-serif text-xl leading-relaxed text-foreground/90 sm:text-2xl sm:leading-loose"
            >
              {poem.verses.map((verse, i) => {
                if (verse.trim() === "") {
                  return <div key={i} aria-hidden className="h-4" />;
                }
                return (
                  <p key={i} className={cn(i === 0 && "drop-cap")}>
                    {verse}
                  </p>
                );
              })}
            </motion.article>

            {/* Pied du poème */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-16 flex flex-col items-center gap-5 border-t border-border/50 pt-8"
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleHeart}
                  aria-pressed={isFavorite}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isFavorite
                      ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/20"
                      : "border-border bg-background hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isFavorite && "fill-primary text-primary",
                      heartAnimating && "animate-heart-beat",
                    )}
                    strokeWidth={2}
                  />
                  {isFavorite ? "Dans vos favoris" : "J'aime ce poème"}
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={2} />
                  )}
                  {copied ? "Copié" : "Copier"}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Share2 className="h-4 w-4" strokeWidth={2} />
                  Partager
                </button>
              </div>

              {poem.isSubmission ? (
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <PenLine className="h-3 w-3" strokeWidth={2} />
                  Poème proposé par la communauté
                </p>
              ) : null}
            </motion.footer>

            {/* Navigation entre poèmes */}
            {onNavigate && (siblings?.prev || siblings?.next) ? (
              <nav className="mt-16 grid grid-cols-2 gap-3 border-t border-border/50 pt-6">
                {siblings?.prev ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(siblings.prev!)}
                    className="group flex flex-col items-start gap-1.5 rounded-2xl border border-border bg-background/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      ← Précédent
                    </span>
                    <span className="line-clamp-1 font-serif text-base font-medium text-foreground">
                      {siblings.prev.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {siblings.prev.author}
                    </span>
                  </button>
                ) : (
                  <div aria-hidden />
                )}
                {siblings?.next ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(siblings.next!)}
                    className="group flex flex-col items-end gap-1.5 rounded-2xl border border-border bg-background/60 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Suivant →
                    </span>
                    <span className="line-clamp-1 font-serif text-base font-medium text-foreground">
                      {siblings.next.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {siblings.next.author}
                    </span>
                  </button>
                ) : null}
              </nav>
            ) : null}

            {/* Astuce clavier */}
            <p className="mt-10 text-center text-xs text-muted-foreground/60">
              Utilisez les flèches{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                ←
              </kbd>{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                →
              </kbd>{" "}
              pour naviguer,{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                Échap
              </kbd>{" "}
              pour fermer
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ReaderActionProps {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  active?: boolean;
}

function ReaderAction({ label, onClick, icon, active }: ReaderActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:text-primary",
      )}
    >
      {icon}
    </button>
  );
}
