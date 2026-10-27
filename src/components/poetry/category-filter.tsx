"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/data/poems";
import type { CategoryId } from "@/types/poem";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: CategoryId | "all";
  onChange: (id: CategoryId | "all") => void;
  counts: Record<string, number>;
  className?: string;
}

export function CategoryFilter({
  selected,
  onChange,
  counts,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className,
      )}
      role="tablist"
      aria-label="Filtrer par catégorie"
    >
      <CategoryChip
        active={selected === "all"}
        onClick={() => onChange("all")}
        count={counts.all ?? 0}
        glyph="✦"
        label="Tous"
      />
      {CATEGORIES.map((cat) => (
        <CategoryChip
          key={cat.id}
          active={selected === cat.id}
          onClick={() => onChange(cat.id)}
          count={counts[cat.id] ?? 0}
          glyph={cat.glyph}
          label={cat.label}
        />
      ))}
    </div>
  );
}

interface CategoryChipProps {
  active: boolean;
  onClick: () => void;
  count: number;
  glyph: string;
  label: string;
}

function CategoryChip({
  active,
  onClick,
  count,
  glyph,
  label,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      <span aria-hidden className="text-xs">
        {glyph}
      </span>
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] tabular-nums",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
      {active ? (
        <motion.span
          layoutId="category-active"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      ) : null}
    </button>
  );
}
