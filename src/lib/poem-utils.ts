import type { Poem } from "@/types/poem";

/**
 * Calcule un temps de lecture estimé en secondes, basé sur :
 *  - ~180 mots/min pour de la prose
 *  - ~120 mots/min pour de la poésie (lecture plus lente, contemplative)
 *
 * On retourne un objet avec les minutes (arrondies) et le nombre de mots.
 */
export function getReadingTime(poem: Poem): {
  minutes: number;
  words: number;
  seconds: number;
} {
  const text = poem.verses.join(" ");
  // Comptage approximatif : on découpe sur les espaces et on filtre les vides
  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0).length;

  const wordsPerMinute = 120; // poésie : lecture lente
  const seconds = Math.max(15, Math.round((words / wordsPerMinute) * 60));
  const minutes = Math.max(1, Math.round(seconds / 60));

  return { minutes, words, seconds };
}

/**
 * Formate un identifiant de poème en un slug lisible.
 * Utilisé pour des ancres ou des URLs futures.
 */
export function slugifyPoem(poem: Poem): string {
  return (
    poem.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || poem.id
  );
}
