"use client";

import * as React from "react";

/**
 * Couche décorative de pétales qui tombent doucement en arrière-plan.
 * Utilise une géomération déterministe (à partir d'un seed) pour éviter
 * les mouvements aléatoires à chaque rendu (pas de re-layout).
 */
export function FloatingPetals({ count = 14 }: { count?: number }) {
  // Génération déterministe des pétales une seule fois
  const petals = React.useMemo(() => {
    // Générateur pseudo-aléatoire à congruence linéaire (LCG)
    // On encapsule l'état mutable dans un objet pour satisfaire la règle
    // d'immutabilité du linter React.
    const state = { value: 42 };
    const rand = () => {
      state.value = (state.value * 9301 + 49297) % 233280;
      return state.value / 233280;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100, // %
      delay: rand() * 18, // s
      duration: 18 + rand() * 14, // s
      size: 8 + rand() * 10, // px
      opacity: 0.3 + rand() * 0.4,
    }));
  }, [count]);

  return (
    <div className="petals-layer" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
