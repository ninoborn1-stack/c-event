import { Btn } from '@/components/Btn';

export default function NotFound() {
  return (
    <section className="nf">
      <span className="micro">Fehler 404 · Falscher Eingang</span>
      <h1 className="nf__title">
        Hier läuft
        <br />
        <span className="serif">heute</span> nichts.
      </h1>
      <Btn href="/" variant="gold" label="Main Stage">
        Zur Hauptbühne
      </Btn>
    </section>
  );
}
