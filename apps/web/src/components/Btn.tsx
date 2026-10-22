import Link from 'next/link';
import type { ReactNode } from 'react';

export function Btn({
  href,
  children,
  variant = 'gold',
  label,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: 'gold' | 'ghost' | 'ink' | 'signal';
  /** Text auf dem Vorhang beim Seitenwechsel. */
  label?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`btn btn--${variant} ${className ?? ''}`} data-label={label}>
      <span className="btn__text">{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
