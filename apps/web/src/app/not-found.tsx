import { TicketLink } from '@/components/ui/Ticket';

export default function NotFound() {
  return (
    <section className="nf">
      <span className="eyebrow">Fehler 404 · Falscher Eingang</span>
      <h1 className="nf__title">
        Hier läuft
        <br />
        <span className="accent">heute</span> nichts.
      </h1>
      <div className="nf__ctas">
        <TicketLink href="/"  label="Main Stage">
          Zur Hauptbühne
        </TicketLink>
        <TicketLink href="/arcade" tone="outline" label="Arcade">
          Oder eine Runde spielen
        </TicketLink>
      </div>
    </section>
  );
}
