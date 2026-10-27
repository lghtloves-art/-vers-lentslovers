"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Poem } from "@/types/poem";

const STORAGE_KEY = "vers-lents:submissions";

const EMPTY: Poem[] = [];

let clientCache: Poem[] | null = null;

function readFromStorage(): Poem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Poem[];
    }
  } catch {
    // Silencieux
  }
  return EMPTY;
}

function getSnapshot(): Poem[] {
  if (clientCache === null) {
    clientCache = readFromStorage();
  }
  return clientCache;
}

function getServerSnapshot(): Poem[] {
  return EMPTY;
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

function persist(next: Poem[]) {
  clientCache = next;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Quota dépassé : on ignore
  }
  emit();
}

/**
 * Hook pour gérer les soumissions de poèmes côté client (localStorage).
 * Sert de brouillon / simulation avant une éventuelle persistance backend.
 */
export function useSubmissions() {
  const submissions = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addSubmission = useCallback(
    (poem: Omit<Poem, "id" | "createdAt" | "isSubmission">) => {
      const newPoem: Poem = {
        ...poem,
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        isSubmission: true,
      };
      persist([newPoem, ...getSnapshot()]);
      return newPoem;
    },
    [],
  );

  const removeSubmission = useCallback((id: string) => {
    persist(getSnapshot().filter((p) => p.id !== id));
  }, []);

  const hydrated = typeof window !== "undefined";

  return {
    submissions,
    hydrated,
    addSubmission,
    removeSubmission,
  };
}
