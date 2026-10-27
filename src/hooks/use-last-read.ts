"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Poem } from "@/types/poem";

const STORAGE_KEY = "vers-lents:last-read";
const FAVORITE_KEY = "vers-lents:favorites";

let clientCache: string | null = null;

function readFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): string | null {
  if (clientCache === null) {
    clientCache = readFromStorage();
  }
  return clientCache;
}

function getServerSnapshot(): string | null {
  return null;
}

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

function persist(next: string) {
  clientCache = next;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  } catch {
    // ignore
  }
  emit();
}

/**
 * Mémorise le dernier poème ouvert par l'utilisateur.
 * Permet d'afficher une section "Reprendre la lecture" sur l'accueil.
 */
export function useLastRead() {
  const lastReadId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLastRead = useCallback((poem: Poem) => {
    persist(poem.id);
  }, []);

  const clear = useCallback(() => {
    persist("");
  }, []);

  // Lecture des favoris pour savoir si le dernier poème lu est liké
  const favoritesRaw = typeof window !== "undefined" ? window.localStorage.getItem(FAVORITE_KEY) : null;

  return {
    lastReadId: lastReadId || null,
    setLastRead,
    clear,
  };
}

/**
 * Hook unifié qui combine favoris + dernière lecture, pour éviter
 * d'appeler plusieurs stores externes dans un même composant.
 */
export function useIsFavoriteById() {
  // On réutilise le cache des favoris via une écoute passive
  const check = useCallback((id: string) => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(FAVORITE_KEY);
      if (!raw) return false;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.includes(id);
    } catch {
      return false;
    }
  }, []);
  return check;
}
