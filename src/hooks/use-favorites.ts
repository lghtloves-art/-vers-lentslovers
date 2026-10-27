"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "vers-lents:favorites";

const EMPTY: string[] = [];

/**
 * Cache mémoire : garantit que `getSnapshot` renvoie toujours la même
 * référence tant que l'état n'a pas changé ( requis par useSyncExternalStore
 * pour éviter les boucles de rendu infinies ).
 */
let clientCache: string[] | null = null;

function readFromStorage(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x) => typeof x === "string");
    }
  } catch {
    // Silencieux : on démarre avec un état vide en cas de corruption
  }
  return EMPTY;
}

function getSnapshot(): string[] {
  if (clientCache === null) {
    clientCache = readFromStorage();
  }
  return clientCache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

// Mini émetteur d'événements interne + écoute des événements `storage`
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(callback: () => void): () => void {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  listeners.add(callback);
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
    listeners.delete(callback);
  };
}

function persist(next: string[]) {
  clientCache = next;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Quota dépassé ou mode privé : on ignore silencieusement
  }
  emit();
}

/**
 * Hook de gestion des favoris, persistés dans localStorage.
 *
 * Utilise `useSyncExternalStore` pour gérer proprement l'hydratation SSR
 * ( snapshot serveur = tableau vide, snapshot client = données lues ).
 */
export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleFavorite = useCallback((id: string) => {
    const current = getSnapshot();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    persist(next);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const clearFavorites = useCallback(() => {
    persist([]);
  }, []);

  // `hydrated` : vrai dès le premier rendu côté client. Permet aux composants
  // d'éviter un flash visuel (par ex. le badge de favoris dans le header).
  const hydrated = typeof window !== "undefined";

  return {
    favorites,
    hydrated,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
