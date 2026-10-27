"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Heart } from "lucide-react";
import { CATEGORIES } from "@/data/poems";
import type { CategoryId, Poem } from "@/types/poem";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SubmissionFormProps {
  onSubmit: (
    poem: Omit<Poem, "id" | "createdAt" | "isSubmission">,
  ) => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  author: string;
  category: CategoryId;
  dedication: string;
  verses: string;
}

const EMPTY: FormState = {
  title: "",
  author: "",
  category: "douceur",
  dedication: "",
  verses: "",
};

export function SubmissionForm({ onSubmit, onCancel }: SubmissionFormProps) {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "Le titre est requis.";
    if (!form.author.trim()) next.author = "Merci d'indiquer un auteur ou pseudonyme.";
    if (!form.verses.trim()) next.verses = "Le poème ne peut pas être vide.";
    else if (form.verses.trim().length < 20)
      next.verses = "Votre poème est bien court… Au moins quelques vers de plus ?";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Normalisation : on découpe par lignes vides pour préserver les strophes
    const verses = form.verses
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trimEnd());

    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      dedication: form.dedication.trim() || undefined,
      verses,
    });

    toast.success("Poème publié", {
      description: `« ${form.title.trim()} » a rejoint le recueil.`,
      icon: <Heart className="h-4 w-4" />,
    });

    setForm(EMPTY);
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-primary/5">
        {/* En-tête */}
        <div className="border-b border-border/70 bg-gradient-to-br from-primary/5 via-rose/5 to-transparent px-6 py-7 sm:px-8">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Heart className="h-3 w-3" strokeWidth={2} />
            Espace de partage
          </p>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Offrez un poème au recueil
          </h2>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
            Vos vers rejoindront les favoris des passants. Écrivez avec le cœur,
            sans crainte du regard des autres — ici, on ne juge que la sincérité.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-7 sm:px-8"
          noValidate
        >
          {/* Titre + Auteur */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Titre"
              required
              error={errors.title}
            >
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Aurore de ton visage"
                maxLength={80}
                className={inputClass(!!errors.title)}
                aria-invalid={!!errors.title}
              />
            </Field>

            <Field
              label="Auteur / Pseudonyme"
              required
              error={errors.author}
            >
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Lucie Verlaine"
                maxLength={60}
                className={inputClass(!!errors.author)}
                aria-invalid={!!errors.author}
              />
            </Field>
          </div>

          {/* Catégorie + Dédicace */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Catégorie">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value as CategoryId)}
                className={inputClass(false)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.glyph} {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Dédicace (optionnel)">
              <input
                type="text"
                value={form.dedication}
                onChange={(e) => update("dedication", e.target.value)}
                placeholder="À celle qui ouvre mes matins"
                maxLength={120}
                className={inputClass(false)}
              />
            </Field>
          </div>

          {/* Vers */}
          <Field
            label="Votre poème"
            required
            error={errors.verses}
            hint="Séparez les strophes par une ligne vide."
          >
            <textarea
              value={form.verses}
              onChange={(e) => update("verses", e.target.value)}
              rows={12}
              placeholder={"Le jour se lève à peine, et déjà ton sourire\nÉclaire ma fenêtre mieux que tous les soleils.\n\nJe n'ose pas bouger, de peur de réveiller\nCe repos mérité, ce fragile bonheur."}
              className={cn(inputClass(!!errors.verses), "font-serif text-base leading-relaxed resize-y")}
              aria-invalid={!!errors.verses}
            />
          </Field>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
              Publier le poème
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-background/60 px-3.5 py-2.5 text-sm transition-colors",
    "placeholder:text-muted-foreground/60",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    hasError
      ? "border-destructive/60 focus-visible:ring-destructive"
      : "border-border",
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-xs font-normal text-muted-foreground">
            requis
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span
          role="alert"
          className="block text-xs font-medium text-destructive"
        >
          {error}
        </span>
      ) : hint ? (
        <span className="block text-xs text-muted-foreground/80">{hint}</span>
      ) : null}
    </label>
  );
}
