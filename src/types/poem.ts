// Types pour l'application de poésie d'amour

export type CategoryId =
  | "passion"
  | "douceur"
  | "nostalgie"
  | "declaration"
  | "absence"
  | "eternel";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  /** Couleur d'accent associée à la catégorie (classe Tailwind partielle) */
  accent: string;
  /** Emoji / glyphe décoratif */
  glyph: string;
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  /** Strophes : chaque entrée du tableau est une strophe séparée par un saut de ligne */
  verses: string[];
  category: CategoryId;
  /** Année de composition ou de publication (optionnel) */
  year?: number;
  /** Courte exergue / dédicace affichée sous le titre */
  dedication?: string;
  /** Indique s'il s'agit d'un poème proposé par la communauté */
  isSubmission?: boolean;
  /** Date ISO de création (pour les soumissions) */
  createdAt?: string;
}

export type ViewId = "home" | "list" | "reader" | "submit" | "favorites";
