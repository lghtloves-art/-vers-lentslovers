"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Library, PenLine, Star } from "lucide-react";
import type { ViewId } from "@/types/poem";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  view: ViewId;
  onNavigate: (view: ViewId) => void;
  favoritesCount: number;
}

const NAV: Array<{
  id: ViewId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { id: "home", label: "Accueil", icon: Heart },
  { id: "list", label: "Recueil", icon: Library },
  { id: "submit", label: "Offrir", icon: PenLine },
  { id: "favorites", label: "Favoris", icon: Star },
];

export function SiteHeader({ view, onNavigate, favoritesCount }: SiteHeaderProps) {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group inline-flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Retour à l'accueil"
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-rose to-gold text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105"
          >
            <Heart className="h-4 w-4 fill-primary-foreground" strokeWidth={2} />
          </span>
          <span className="hidden font-serif text-xl font-semibold tracking-tight sm:inline">
            Vers lents
          </span>
        </button>

        {/* Nav principale (desktop) */}
        <nav className="hidden md:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = view === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    {item.label}
                    {item.id === "favorites" && favoritesCount > 0 ? (
                      <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
                        {favoritesCount}
                      </span>
                    ) : null}
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {/* Nav mobile : barre flottante fixée en bas */}
      <nav
        aria-label="Navigation mobile"
        className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border/60 md:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
          {NAV.map((item) => {
            const active = view === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    active
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.id === "favorites" && favoritesCount > 0 ? (
                      <span className="absolute -right-2.5 -top-1.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground tabular-nums">
                        {favoritesCount}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active-mobile"
                      aria-hidden
                      className="absolute inset-x-3 top-0 -z-10 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

interface SiteFooterProps {
  onNavigate: (view: ViewId) => void;
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/40">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-rose text-primary-foreground"
            >
              <Heart className="h-3 w-3 fill-primary-foreground" strokeWidth={2} />
            </span>
            <span className="font-serif text-base">Vers lents</span>
            <span aria-hidden>·</span>
            <span>recueil de poésie d'amour</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => onNavigate("submit")}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              Offrir un poème
            </button>
            <button
              type="button"
              onClick={() => onNavigate("list")}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              Parcourir
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground/70 sm:text-left">
          Fait avec patience, en vers et en cœur. Vos favoris sont conservés sur
          cet appareil.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground/60 sm:justify-start">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">/</kbd>
            rechercher
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">h</kbd>
            accueil
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">f</kbd>
            favoris
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">r</kbd>
            poème aléatoire
          </span>
        </div>
      </div>
    </footer>
  );
}
