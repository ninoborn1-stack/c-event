# Offene Platzhalter

Automatisch erzeugt aus `packages/content` (alles, was mit `ph()` markiert ist). Stand: 22.10.2026. **212 Einträge.**

Neu erzeugen: `pnpm docs:placeholders`. Dieselbe Liste zeigt das Demo-Cockpit unter `/demo#platzhalter`.

## Marke & Logo (2)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Logo als Vektordatei (SVG) fehlt, Namenswechsel im Januar beachten | `brand.logo` | 1 |
| Slogan fehlt. Nino schlägt drei Varianten vor, Celia wählt | `brand.slogans` | 1 |

## Einsatzgebiet (1)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Einsatzgebiet und Anfahrtskosten mit Celia klären | `brand.region` | 1 |

## Kontakt & Social (5)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Echte E-Mail-Adresse fehlt (Postfach/Anbieter klären) | `brand.contact.email` | 1 |
| Telefonnummer fehlt | `brand.contact.phone` | 1 |
| WhatsApp-Nummer fehlt (nur Ziffern mit Ländervorwahl) | `brand.contact.whatsapp` | 1 |
| Empfänger der Anfragen festlegen (E-Mail, ggf. WhatsApp) | `brand.contact.inquiryRecipient` | 1 |
| Social-Media-Accounts zum Verlinken fehlen | `brand.social` | 1 |

## Partner (4)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Link zur Bunker-West-Seite fehlt | `partners.bunkerWest.href` | 1 |
| Willkommens-Code ca. 10 %, mit Albi abstimmen | `partners.bunkerWest.code` | 1 |
| Höhe des Rabatts mit Albi klären | `partners.bunkerWest.discount` | 1 |
| Netzwerk und Partner mit Celia bestätigen | `about.network` | 1 |

## Referenzen (4)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Referenz-Platzhalter. Echte Events mit Freigabe der Kunden von Celia | `home.highlights.items` | 1 |
| Kundenstimmen fehlen, nur mit Freigabe veröffentlichen | `home.voices.items` | 1 |
| Kundenlogos fehlen, nur mit Freigabe | `home.voices.logos` | 1 |
| Referenzen nur nach Freigabe der Beteiligten (Yami Club, JD Sports o. ä.) | `socialMedia.references` | 1 |

## Texte (24)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Text-Vorschlag von Nino. Celia liefert Stichpunkte, dann finaler Text | `services[0].intro`<br>`services[0].points`<br>`services[1].intro`<br>… +11 | 14 |
| FAQ-Vorschlag. Durch echte Kundenfragen von Celia ersetzen | `services[0].faq`<br>`services[1].faq`<br>`services[2].faq`<br>… +4 | 7 |
| Social-Media-Leistungsbeschreibung: Entwurf von Nino, Freigabe durch Celia | `socialMedia.hero.lead` | 1 |
| Umfang und Umsetzung (Celia, Josh, Partner) klären | `socialMedia.blocks` | 1 |
| Geschichte der Agentur von Celia | `about.story` | 1 |

## Team (1)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Teamfotos und -texte fehlen | `about.team` | 1 |

## Equipment & Preise (75)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Artikeltext-Vorschlag, mit Celia abstimmen | `catalog.items[0].short`<br>`catalog.items[1].short`<br>`catalog.items[2].short`<br>… +19 | 22 |
| Preis-Vorschlag. Echte Mietpreise aus Celias Equipment-Liste fehlen | `catalog.items[0].price`<br>`catalog.items[1].price`<br>`catalog.items[2].price`<br>… +19 | 22 |
| Kaution fehlt | `catalog.items[0].depositCents`<br>`catalog.items[3].depositCents`<br>`catalog.items[12].depositCents`<br>… +6 | 9 |
| Stückzahl fehlt | `catalog.items[0].stock`<br>`catalog.items[1].stock`<br>`catalog.items[2].stock`<br>… +19 | 22 |

## Pakete (3)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Paketpreis-Vorschlag, Pakete und Preise kommen von Celia | `catalog.packages[0].price`<br>`catalog.packages[1].price` | 2 |
| Paketpreis fehlt, Pakete und Preise kommen von Celia | `catalog.packages[2].price` | 1 |

## Rechtliches (9)

| Was fehlt | Wo (Pfad im Content) | Anzahl |
|---|---|---|
| Firmenname und Rechtsform | `legal.impressum.fields.company` | 1 |
| Anschrift | `legal.impressum.fields.street` | 1 |
| PLZ und Ort | `legal.impressum.fields.city` | 1 |
| Vertretungsberechtigte Person | `legal.impressum.fields.representative` | 1 |
| Registergericht und -nummer (falls vorhanden) | `legal.impressum.fields.register` | 1 |
| USt-IdNr. | `legal.impressum.fields.vatId` | 1 |
| Verantwortlich i. S. d. § 18 Abs. 2 MStV | `legal.impressum.fields.responsible` | 1 |
| Datenschutzerklärung vor Livegang prüfen (Hosting, Mail-Anbieter, Kalender) | `legal.datenschutz.note` | 1 |
| Mietbedingungen und AGB fehlen | `legal.agb.note` | 1 |

## Medien (84)

Alle 84 Bilder/Videos sind Stockmaterial bzw. Demo-Loops und werden 1:1 über die IDs in `packages/content/src/media.ts` gegen Celias Material getauscht.
