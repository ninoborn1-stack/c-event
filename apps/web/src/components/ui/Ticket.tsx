import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * EINE CTA-Komponente für die ganze Seite: Ticket mit Perforation und Abriss-Stub.
 * Stil zentral über die Ticket-Tokens (design-tokens.ts → --ticket-*).
 */
type Tone = 'red' | 'cream' | 'outline';
type Size = 'md' | 'lg' | 'sm';

interface Common {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  /** Inhalt des Abriss-Stubs (Standard: Pfeil) */
  stub?: ReactNode;
  className?: string;
  full?: boolean;
}

const cls = ({ tone = 'red', size = 'md', className, full }: Common) =>
  `tk tk--${tone} tk--${size}${full ? ' tk--full' : ''} ${className ?? ''}`;

function Inner({ children, stub }: Pick<Common, 'children' | 'stub'>) {
  return (
    <>
      <span className="tk__main">{children}</span>
      <span className="tk__stub" aria-hidden="true">
        {stub ?? '→'}
      </span>
    </>
  );
}

export function TicketLink(props: Common & { href: string; label?: string; external?: boolean }) {
  if (props.external)
    return (
      <a href={props.href} className={cls(props)} target="_blank" rel="noopener noreferrer">
        <Inner stub={props.stub ?? '↗'}>{props.children}</Inner>
      </a>
    );
  return (
    <Link href={props.href} className={cls(props)} data-label={props.label}>
      <Inner stub={props.stub}>{props.children}</Inner>
    </Link>
  );
}

export function TicketButton(
  props: Common & { onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; ariaLabel?: string },
) {
  return (
    <button type={props.type ?? 'button'} className={cls(props)} onClick={props.onClick} disabled={props.disabled} aria-label={props.ariaLabel}>
      <Inner stub={props.stub}>{props.children}</Inner>
    </button>
  );
}
