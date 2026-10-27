"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher un mot, un vers, un auteur…",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center w-full",
        className,
      )}
    >
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground"
        strokeWidth={2}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher un poème"
        className={cn(
          "h-11 w-full rounded-full border border-border bg-background/70 pl-10 pr-10 text-sm",
          "placeholder:text-muted-foreground/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "backdrop-blur",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}
