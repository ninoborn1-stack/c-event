import Link from 'next/link';

/** Kleines Demo-Kennzeichen mit Sprung ins Cockpit. Nur im Demo-Modus gerendert. */
export function DemoBadge({ placeholders }: { placeholders: number }) {
  return (
    <Link href="/demo" className="demo-badge" data-no-curtain>
      <i className="live-dot" aria-hidden="true" />
      Demo · Cockpit
      <small>{placeholders} Platzhalter</small>
    </Link>
  );
}
