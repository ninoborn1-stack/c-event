import { isPlaceholder } from '@c-event/core';
import { brand } from '@c-event/content';

/**
 * Typografischer Logo-Platzhalter nach dem Instagram-Profilbild:
 * „CN“ in heller, geometrischer Sans auf schwarzem Kreis, darunter klein „EVENT AGENCY“.
 * Wird durch Celias Vektor-Logo ersetzt (brand.logo ist als Platzhalter markiert).
 */
export function Logo({ size = 44, withRing = true }: { size?: number; withRing?: boolean }) {
  const ph = isPlaceholder(brand.logo);
  return (
    <svg
      className={`logo-mark${ph ? ' ph' : ''}`}
      data-ph-note={ph ? brand.logo.note : undefined}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={brand.name}
    >
      <circle cx="50" cy="50" r="49" fill="#0b0908" />
      {withRing && <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(242,236,227,.18)" strokeWidth="1" />}
      {/* C */}
      <path d="M 46.3 35.7 A 16 16 0 1 0 46.3 56.3 L 41.7 52.4 A 10 10 0 1 1 41.7 39.6 Z" fill="var(--color-cream)" />
      {/* N */}
      <path d="M 50 30 H 56 L 65 49 V 30 H 71 V 62 H 65 L 56 43 V 62 H 50 Z" fill="var(--color-cream)" />
      <text x="50" y="77" textAnchor="middle" fontSize="7.4" letterSpacing="1.6" fill="var(--color-cream)" fontFamily="var(--font-sans)" fontWeight="600">
        {brand.logoSub.toUpperCase()}
      </text>
    </svg>
  );
}
