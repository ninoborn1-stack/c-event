import Link from 'next/link';

/** Kleines Demo-Kennzeichen mit Sprung in den Admin-Bereich. Nur im Demo-Modus gerendert. */
export function DemoBadge({ placeholders }: { placeholders: number }) {
  return (
    <Link href="/admin" className="demo-badge" data-no-curtain>
      Demo · Admin
      <small>{placeholders} Platzhalter</small>
    </Link>
  );
}
