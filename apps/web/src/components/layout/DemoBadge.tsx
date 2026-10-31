import Link from 'next/link';

/** Kleines Demo-Kennzeichen mit Sprung in den Admin-Bereich. Nur im Demo-Modus gerendert. */
export function DemoBadge() {
  return (
    <Link href="/admin" className="demo-badge" data-no-curtain>
      Demo · Admin
    </Link>
  );
}
