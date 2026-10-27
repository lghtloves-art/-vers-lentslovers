"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId, Poem, ViewId } from "@/types/poem";
import { POEMS, getPoemOfTheDay } from "@/data/poems";
import { useFavorites } from "@/hooks/use-favorites";
import { useSubmissions } from "@/hooks/use-submissions";
import { useLastRead } from "@/hooks/use-last-read";
import { SiteHeader, SiteFooter } from "@/components/poetry/site-header";
import { HomeView } from "@/components/poetry/home-view";
import { ListView } from "@/components/poetry/list-view";
import { FavoritesView } from "@/components/poetry/favorites-view";
import { SubmissionForm } from "@/components/poetry/submission-form";
import { PoemReader } from "@/components/poetry/poem-reader";
import { FloatingPetals } from "@/components/poetry/floating-petals";
import { ContinueReading } from "@/components/poetry/continue-reading";
import { BackToTop } from "@/components/poetry/back-to-top";

export default function Home() {
  const [view, setView] = React.useState<ViewId>("home");
  const [openPoem, setOpenPoem] = React.useState<Poem | null>(null);
  const [listInitialCategory, setListInitialCategory] = React.useState<
    CategoryId | "all"
  >("all");

  const { submissions, addSubmission } = useSubmissions();
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    hydrated,
    count,
  } = useFavorites();
  const { lastReadId, setLastRead, clear: clearLastRead } = useLastRead();

  // Poèmes combinés : base + soumissions de l'utilisateur
  const allPoems = React.useMemo<Poem[]>(
    () => [...submissions, ...POEMS],
    [submissions],
  );

  const poemOfTheDay = React.useMemo(() => getPoemOfTheDay(POEMS), []);

  const favoritePoems = React.useMemo(
    () => allPoems.filter((p) => favorites.includes(p.id)),
    [allPoems, favorites],
  );

  // Dernier poème lu (pour la section "Continuer la lecture")
  const lastReadPoem = React.useMemo<Poem | null>(() => {
    if (!lastReadId) return null;
    return allPoems.find((p) => p.id === lastReadId) ?? null;
  }, [lastReadId, allPoems]);

  // Pour la navigation précédent/suivant dans le lecteur
  const siblings = React.useMemo(() => {
    if (!openPoem) return { prev: undefined, next: undefined };
    const idx = allPoems.findIndex((p) => p.id === openPoem.id);
    if (idx === -1) return { prev: undefined, next: undefined };
    return {
      prev: idx > 0 ? allPoems[idx - 1] : undefined,
      next: idx < allPoems.length - 1 ? allPoems[idx + 1] : undefined,
    };
  }, [openPoem, allPoems]);

  // Scroll to top à chaque changement de vue
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Raccourcis clavier globaux
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ne pas déclencher si l'utilisateur tape dans un champ
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (target.isContentEditable) return;
      }
      // Ne pas déclencher si le lecteur est ouvert (il a ses propres raccourcis)
      if (openPoem) return;

      if (e.key === "/" || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        setView("list");
      } else if (e.key === "h") {
        setView("home");
      } else if (e.key === "f") {
        setView("favorites");
      } else if (e.key === "r" && !openPoem) {
        // Poème aléatoire
        const random = allPoems[Math.floor(Math.random() * allPoems.length)];
        if (random) {
          setOpenPoem(random);
          setLastRead(random);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPoem, allPoems, setLastRead]);

  const handleNavigate = (next: ViewId) => {
    if (next === "list" && view !== "list") {
      setListInitialCategory("all");
    }
    setView(next);
  };

  const handlePickCategory = (categoryId: string) => {
    setListInitialCategory(categoryId as CategoryId | "all");
    setView("list");
  };

  const handleOpenPoem = (poem: Poem) => {
    setOpenPoem(poem);
    setLastRead(poem);
  };

  const handleRandomPoem = () => {
    if (allPoems.length === 0) return;
    const random = allPoems[Math.floor(Math.random() * allPoems.length)];
    if (random) {
      setOpenPoem(random);
      setLastRead(random);
    }
  };

  const handleSubmitPoem = (
    poem: Omit<Poem, "id" | "createdAt" | "isSubmission">,
  ) => {
    const created = addSubmission(poem);
    setTimeout(() => setOpenPoem(created), 50);
    setView("home");
  };

  return (
    <div className="poetic-bg flex min-h-screen flex-col">
      <FloatingPetals count={12} />
      <SiteHeader
        view={view}
        onNavigate={handleNavigate}
        favoritesCount={hydrated ? count : 0}
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === "home" && (
                <>
                  {/* Section "Continuer la lecture" si un poème a déjà été ouvert */}
                  {lastReadPoem ? (
                    <ContinueReading
                      poem={lastReadPoem}
                      isFavorite={isFavorite(lastReadPoem.id)}
                      onOpen={handleOpenPoem}
                      onDismiss={clearLastRead}
                    />
                  ) : null}

                  <HomeView
                    poemOfTheDay={poemOfTheDay}
                    totalPoems={allPoems.length}
                    favoritesCount={hydrated ? count : 0}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onOpenPoem={handleOpenPoem}
                    onBrowse={() => handleNavigate("list")}
                    onSubmit={() => handleNavigate("submit")}
                    onGoToFavorites={() => handleNavigate("favorites")}
                    onPickCategory={handlePickCategory}
                  />
                </>
              )}

              {view === "list" && (
                <ListView
                  poems={allPoems}
                  initialCategory={listInitialCategory}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenPoem={handleOpenPoem}
                  onRandomPoem={handleRandomPoem}
                />
              )}

              {view === "favorites" && (
                <FavoritesView
                  poems={favoritePoems}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onOpenPoem={handleOpenPoem}
                  onBrowse={() => handleNavigate("list")}
                  onClear={clearFavorites}
                />
              )}

              {view === "submit" && (
                <SubmissionForm
                  onSubmit={handleSubmitPoem}
                  onCancel={() => handleNavigate("home")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <SiteFooter onNavigate={handleNavigate} />
      <BackToTop />

      {/* Lecteur immersif (overlay) */}
      <AnimatePresence>
        {openPoem ? (
          <PoemReader
            poem={openPoem}
            isFavorite={isFavorite(openPoem.id)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setOpenPoem(null)}
            onNavigate={handleOpenPoem}
            siblings={siblings}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
