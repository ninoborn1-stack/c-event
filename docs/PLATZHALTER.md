# Offene Platzhalter

Automatisch erzeugt aus `packages/content` (alles, was mit `ph()` markiert ist). Stand: 23.10.2026. **234 Einträge**, davon **200 × P1**.

- **P1** = vor dem Bau nötig (Briefing 2)
- **P2** = nach und nach; für den Livegang sind nur **Domain** und **Impressum** zwingend

Neu erzeugen: `pnpm docs:placeholders`. Dieselbe Liste zeigt der Admin unter `/admin#demo`. Die Spalte „Vorschlag“ ist das, was die Demo gerade zeigt.

## P1 (200)

### Equipment & Preise (75)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Artikeltext-Vorschlag, mit Celia abstimmen | Modulare Theke mit LED-Front, Kühlfach und Spülstation. | `catalog.items[0].short`<br>`catalog.items[1].short`<br>… +20 | 22 |
| Artikel-Liste: Mietpreis aus Celias Liste (Name, Foto, Stückzahl, Mietpreis, Kaution) | {"amountCents":45000,"unit":"pro Event"} | `catalog.items[0].price`<br>`catalog.items[1].price`<br>… +20 | 22 |
| Kaution fehlt | 30000 | `catalog.items[0].depositCents`<br>`catalog.items[3].depositCents`<br>… +7 | 9 |
| Stückzahl fehlt | 2 | `catalog.items[0].stock`<br>`catalog.items[1].stock`<br>… +20 | 22 |

### Kontakt & Social (1)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Empfänger der Anfragen festlegen (E-Mail oder WhatsApp) | anfragen@cn-event.de | `brand.contact.inquiryRecipient` | 1 |

### Marke & Logo (5)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Name von Celia bestätigen; ab Januar vermutlich „CN Event“ | CN Event Agency | `brand.nameStatus` | 1 |
| Logo als Vektordatei (SVG) von Celia; aktuell nachgebaut nach dem Instagram-Profilbild | Typografischer Platzhalter: „CN“ auf schwarzem Kreis, darunter „EVENT AGENCY“ | `brand.logo` | 1 |
| Slogan: Celia wählt eine der drei Varianten oder liefert einen eigenen | [{"lines":["Ideen","auf die","Bühne."],"second":["Doors open.","Berlin."]},{"… | `brand.slogans` | 1 |
| Schriften und Farben: Celias CI oder Okay für unsere Richtung | Headlines: Archivo Black/Condensed (blockig), Text: DM Sans; Farben Dunkel #1… | `briefing.design.fontsColors` | 1 |
| Ticket-Stil der CTAs und des Warenkorbs (Celia klärt „ein bisschen weibig“) | Weiche Radien (14 px), Perforation, Rot als Ticket-Farbe – „ein bisschen weib… | `briefing.design.ticketStyle` | 1 |

### Medien (85)

Alle 85 Bilder/Videos sind Stockmaterial bzw. Demo-Loops. Jede Position hat in `packages/content/src/media.ts` ein **Wunschmotiv** (`motif`), damit Celias Material 1:1 zugeordnet werden kann.

Richtwerte: Hero 2–3 Clips à 10–30 s (quer + hochkant) · 5–10 Fotos je Leistung · 20–40 für die Galerie · 1 je Shop-Artikel · 1 je Teammitglied.

| Datei-ID | Wunschmotiv |
|---|---|
| `konfetti-buehne-crowd` | HERO: Clip 10–30 s, quer + hochkant – Höhepunkt eines Abends (Konfetti, volle Tanzfläche, Bühne) |
| `lichtshow-festival-buehne` | Eigenes Foto: Bunte Lichtshow und Konfetti über einem großen Publikum |
| `weisses-buehnenlicht-crowd` | Eigenes Foto: Weiße Scheinwerferstrahlen über einem Publikum mit erhobenen Händen |
| `crowd-herz-haende` | Eigenes Foto: Gäste formen vor der Bühne ein Herz mit den Händen |
| `buehne-gelbes-licht` | Eigenes Foto: Bühne mit gelbem Licht vor einem dichten Publikum |
| `buehne-gegenlicht-rauch` | Eigenes Foto: Gegenlicht und Rauch über einem Konzertpublikum |
| `firmenfeier-festsaal` | Eigenes Foto: Eingedeckter Festsaal mit runden Tischen für eine Firmenfeier |
| `whisky-pour-bar` | Bar-Catering Hero: Bar in Aktion, warmes Licht, Hände beim Mixen |
| `mikrofon-publikum` | Eigenes Foto: Mikrofon im Vordergrund vor einem Publikum |
| `haende-im-spotlight` | Eigenes Foto: Erhobene Hände im Lichtkegel auf einer dunklen Tanzfläche |
| `weihnachtsbaum-kugeln` | Eigenes Foto: Goldene Weihnachtskugel am Baum mit warmem Licht |
| `anstossen-nachts` | Eigenes Foto: Gäste stoßen nachts mit Drinks an |
| `artist-rauch-buehne` | Eigenes Foto: Artist auf der Bühne in Rauch und rotem Licht |
| `dj-party-crowd` | Eigenes Foto: DJ am Pult vor einer tanzenden Menge mit Nebel |
| `crowd-handy-licht` | Eigenes Foto: Gäste filmen die Show mit dem Handy, buntes Bühnenlicht |
| `club-buehne-dunkel` | Eigenes Foto: Dunkle Clubbühne mit Lichttraversen |
| `konfetti-blau-crowd` | Event-Organisation Hero: Gesamtbild eines eurer Events |
| `keynote-leinwand` | Eigenes Foto: Keynote mit großer Leinwand vor Publikum in einer Halle |
| `festival-lila-licht` | Eigenes Foto: Festivalpublikum in lila Bühnenlicht |
| `crowd-goldenes-licht` | Eigenes Foto: Publikum mit erhobenen Händen im goldenen Gegenlicht |
| `konferenzsaal` | Eigenes Foto: Konferenzsaal mit Leinwänden und weißen Tischen |
| `dinner-tafel-blumen` | Eigenes Foto: Lange Dinnertafel mit Blumen und Gläsern |
| `konfetti-nah` | Eigenes Foto: Buntes Konfetti in der Luft vor türkisem Hintergrund |
| `bar-tresen-regal` | Eigenes Foto: Bar mit beleuchtetem Flaschenregal und Hockern |
| `konzert-pink` | Eigenes Foto: Konzert mit pinkem und rotem Bühnenlicht |
| `gartenparty-crowd` | Eigenes Foto: Gäste auf einer Party unter Lichterketten |
| `hochzeit-tafel` | Dekoration Hero: dekorierte Tafel oder Raum im Detail |
| `weinglaeser-anstossen` | Eigenes Foto: Gäste stoßen mit Weingläsern an |
| `klavier-detail` | Eigenes Foto: Tasten eines Flügels im warmen Licht |
| `konzert-bernstein` | Eigenes Foto: Konzertpublikum vor bernsteinfarbener Bühne |
| `bar-flaschen-rot` | Eigenes Foto: Flaschen auf der Bar im roten Gegenlicht |
| `mikrofon-blau` | Eigenes Foto: Mikrofon auf einer Bühne in blauem Licht |
| `dinner-gesellschaft` | Eigenes Foto: Gesellschaft beim gemeinsamen Dinner |
| `ballons-bunt` | Eigenes Foto: Bunte Ballons an der Decke |
| `funken-buehne-crowd` | Eigenes Foto: Funkenregen über einer Bühne und Publikum |
| `cocktail-dunkel` | Eigenes Foto: Dunkler Cocktail mit getrockneter Zitrusscheibe |
| `publikum-dunkel` | Eigenes Foto: Publikum in einem abgedunkelten Saal |
| `tanzende-gaeste` | Eigenes Foto: Gäste tanzen ausgelassen auf einer Party |
| `cocktails-drei` | Eigenes Foto: Drei bunte Cocktails auf einem Bartresen |
| `buffet-catering` | Eigenes Foto: Buffet mit warmen Speisen in Chafing Dishes |
| `talk-publikum` | Eigenes Foto: Publikum bei einem Talk in einem Loft |
| `dessert-beeren` | Eigenes Foto: Dessert mit Himbeeren auf dunklem Teller |
| `bar-lichter` | Eigenes Foto: Bar mit vielen warmen Glühbirnen |
| `bar-vintage` | Eigenes Foto: Vintage-Bar mit Holztresen und Lichtern |
| `stuhl-design` | Eigenes Foto: Gepolsterter Designstuhl vor hellem Hintergrund |
| `fine-dining` | Eigenes Foto: Gedeckter Tisch mit Speisen und Weingläsern |
| `mobile-bar-anhaenger` | Eigenes Foto: Mobile Bar in einem Anhänger mit Lichterketten bei Nacht |
| `barkeeper-strainer` | Eigenes Foto: Barkeeper gießt einen Drink durch das Barsieb in ein Coupe-Glas |
| `champagner-turm-gold` | Eigenes Foto: Pyramide aus Champagnergläsern mit goldenem Sekt |
| `kellner-tablett` | Eigenes Foto: Kellner trägt ein Tablett mit Drinks durch den Raum |
| `eingang-einlass` | Eigenes Foto: Verzierter Eingang einer Location, an dem Gäste begrüßt werden |
| `aufbau-open-air` | Eigenes Foto: Aufgebaute Tischreihen und Bühnentraversen vor einem Open-Air-Event |
| `canapes-auswahl` | Eigenes Foto: Auswahl an Canapés und Fingerfood auf einer Platte |
| `koch-anrichten` | Eigenes Foto: Fein angerichteter Teller mit Fisch und Gemüse |
| `burger-late-night` | Eigenes Foto: Burger mit Pommes als Late-Night-Snack |
| `deko-pink-tafel` | Eigenes Foto: Festlich dekorierter Saal mit pinkem Licht und runden Tischen |
| `tischdeko-blumen` | Eigenes Foto: Gedeckter Tisch mit Blumenarrangement und Gläsern |
| `neon-lets-party` | Eigenes Foto: Pinker Neon-Schriftzug „Let’s Party“ vor Glitzervorhang |
| `stehtische-saal` | Eigenes Foto: Leerer Veranstaltungsraum mit eingedeckten Stehtischen |
| `lounge-sofas-gruen` | Eigenes Foto: Grüne Chesterfield-Sofas als Lounge mit Blumen |
| `pa-line-array` | Eigenes Foto: Hängender Line-Array-Lautsprecher an einer Bühnentraverse |
| `dj-mixer` | Eigenes Foto: DJ-Setup mit Mixer und Laptop im Clublicht |
| `lichtshow-buehne` | Equipment Hero: euer Equipment im Einsatz (Licht, Sound, Bar) |
| `scheinwerfer-stativ` | Eigenes Foto: Moving Head Scheinwerfer im Rauch |
| `buehne-lila-licht` | Eigenes Foto: Leere Bühne mit lila Licht und Nebel |
| `regie-silhouette` | Team: Porträt Produktion & Technik |
| `moodboard-bilder` | Eigenes Foto: Moodboard mit Fotos und Materialien auf einem Tisch |
| `weihnachtstafel-lichter` | Eigenes Foto: Festliche Weihnachtstafel unter Lichterketten |
| `gala-tafel-kerzen` | Eigenes Foto: Lange Gala-Tafel mit Kerzen und Blumen |
| `sneaker-wand` | Eigenes Foto: Wand mit Sneakern in einem Store |
| `sneaker-store-sw` | Eigenes Foto: Sneaker-Regal in einem Store, schwarz-weiß |
| `party-lichterketten` | Eigenes Foto: Gäste feiern unter Lichterketten auf einer Sommerparty |
| `filmset-kamera` | Eigenes Foto: Professionelle Filmkamera am Set eines Drehs |
| `videograf` | Team: Porträt Josh |
| `hochzeit-loft` | Eigenes Foto: Hochzeitstafeln in einem Loft mit Lichterketten |
| `ballons-nacht` | Eigenes Foto: Leuchtende Heißluftballons in der Nacht über dem Wasser |
| `planerin-notizbuch` | Team: Porträt Celia |
| `barcrew-team` | Team: Porträt Bar & Crew-Leitung |
| `bunker-beton` | Bunker West: Außen- oder Innenansicht der Location |
| `buffet-gaeste` | Catering Hero: Gäste am Buffet / Flying Dinner, warmes Licht |
| `buehne-traversen` | Event-Management Hero: Bühne/Technik beim Aufbau oder Show-Moment |
| `service-kellnerin` | Personal Hero: Service-Crew im Einsatz auf vollem Event |
| `video-dj-loop` | Video: DJ / Tanzfläche, 10–30 s, hochkant für Social |
| `video-funken-loop` | Video: Show-Moment (Funken, Bühne), 10–30 s, quer |

### Pakete (3)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Paketpreis-Vorschlag; Pakete und Preise kommen von Celia | {"amountCents":149000,"unit":"pro Event","mode":"from"} | `catalog.packages[0].price`<br>`catalog.packages[1].price` | 2 |
| Paketpreis fehlt, Pakete und Preise kommen von Celia | {"amountCents":null,"unit":"pro Event"} | `catalog.packages[2].price` | 1 |

### Shop (4)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Shop-Name: „Shop“, „Konfigurator“ oder „Event zusammenstellen“ | Shop | `shop.label` | 1 |
| Begriff für den Warenkorb: „Rider“ oder „Dein Event“ | Dein Event | `shop.cartLabel` | 1 |
| Preisanzeige: fest / ab / auf Anfrage – global schaltbar | Richtpreise sichtbar, Pakete „ab“, individuelle Leistungen „auf Anfrage“ | `briefing.offer.priceDisplay` | 1 |
| Formularfelder festlegen | Pflicht: Kategorie, Name, E-Mail, Datenschutz. Optional: Firma, Telefon, Anla… | `briefing.offer.formFields` | 1 |

### Team (1)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Team: Namen, Rollen, Fotos und je ein Satz (Instagram-Highlight „Team“) | [{"name":"Celia","role":"Gründerin & Inhaberin","text":"Idee, Angebot, Regie … | `about.team` | 1 |

### Texte (26)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Text-Vorschlag von Nino. Celia liefert Stichpunkte, dann finaler Text | Die Bar ist der Ort, an dem ein Abend kippt, vom höflichen Smalltalk zum Aben… | `services[0].intro`<br>`services[0].points`<br>… +12 | 14 |
| FAQ-Vorschlag. Durch echte Kundenfragen von Celia ersetzen | [{"q":"Ab wie vielen Gästen lohnt sich eine mobile Bar?","a":"Ab etwa 30 Gäst… | `services[0].faq`<br>`services[1].faq`<br>… +5 | 7 |
| Social-Media-Leistungsbeschreibung: Entwurf von Nino, Freigabe durch Celia | Ein Event dauert eine Nacht. Der Content dazu läuft Monate. Wir entwickeln St… | `socialMedia.hero.lead` | 1 |
| Umfang und Umsetzung (Celia, Josh, Partner) klären | [{"title":"Strategie & Beratung","text":"Zielgruppe, Kanäle, Tonalität, Posti… | `socialMedia.blocks` | 1 |
| Geschichte der Agentur von Celia | CN Event Agency ist aus einer einfachen Beobachtung entstanden: Die meisten I… | `about.story` | 1 |
| Finale Leistungen bestätigen (fehlt etwas, fällt etwas weg?) | Bar-Catering, Personal, Catering, Event-Management, Event-Organisation, Dekor… | `briefing.offer.finalServices` | 1 |
| Umfang des Social-Media-Angebots und wer umsetzt (Celia, Josh, Partner) | Strategie & Beratung, Content-Production, Skripte, Handbuch, laufende Begleitung | `briefing.offer.socialScope` | 1 |

## P2 (34)

### Einsatzgebiet (1)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Einsatzgebiet und Anfahrtskosten mit Celia klären | Berlin & Brandenburg | `brand.region` | 1 |

### Kontakt & Social (4)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Echte E-Mail-Adresse (Postfach/Anbieter klären) | hallo@cn-event.de | `brand.contact.email` | 1 |
| Telefonnummer | +49 30 000 000 00 | `brand.contact.phone` | 1 |
| WhatsApp-Nummer (nur Ziffern mit Ländervorwahl) | +4917000000000 | `brand.contact.whatsapp` | 1 |
| Weitere Kanäle (TikTok, LinkedIn …) bestätigen; Instagram ist @cneventagency | [{"label":"Instagram","href":"https://www.instagram.com/cneventagency/"},{"la… | `brand.social` | 1 |

### Organisation (4)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Wer gibt Feedback und Freigaben? | Celia | `briefing.organisation.approver` | 1 |
| Corporate-Strecke auf eigener Subdomain | Später: corporate.<domain> | `briefing.organisation.corporate` | 1 |
| Englische Version? | Erst Deutsch | `briefing.organisation.english` | 1 |
| Statistik und Newsletter | Datenschutzfreundliche Statistik ohne Cookie-Banner, kein Newsletter | `briefing.organisation.analytics` | 1 |

### Partner (4)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Bunker-West-Verlinkung (URL) | https://bunker-west.example | `partners.bunkerWest.href` | 1 |
| Willkommens-Code ca. 10 %, mit Albi abstimmen | CNEVENT10 | `partners.bunkerWest.code` | 1 |
| Höhe des Rabatts mit Albi klären | 10 % | `partners.bunkerWest.discount` | 1 |
| Netzwerk und Partner mit Celia bestätigen | ["Bunker West · Location","Partnerküchen Berlin","Licht- & Tontechnik","Flori… | `about.network` | 1 |

### Rechtliches (10)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Datenschutz-Kontakt | Celia [Nachname], Anschrift wie Impressum | `briefing.legal.privacyContact` | 1 |
| Impressum: Firmenname und Rechtsform | CN Event Agency [Rechtsform] | `legal.impressum.fields.company` | 1 |
| Anschrift | Musterstraße 1 | `legal.impressum.fields.street` | 1 |
| PLZ und Ort | 10115 Berlin | `legal.impressum.fields.city` | 1 |
| Vertretungsberechtigte Person | Celia [Nachname] | `legal.impressum.fields.representative` | 1 |
| Registergericht und -nummer (falls vorhanden) | Amtsgericht Berlin-Charlottenburg, HRB 000000 | `legal.impressum.fields.register` | 1 |
| USt-IdNr. | DE000000000 | `legal.impressum.fields.vatId` | 1 |
| Verantwortlich i. S. d. § 18 Abs. 2 MStV | Celia [Nachname], Anschrift wie oben | `legal.impressum.fields.responsible` | 1 |
| Datenschutzerklärung vor Livegang prüfen (Hosting, Mail-Anbieter, Kalender) | Vorlage, vor Livegang rechtlich prüfen lassen | `legal.datenschutz.note` | 1 |
| Mietbedingungen und AGB fehlen | Vorlage, Mietbedingungen und AGB kommen von Celia | `legal.agb.note` | 1 |

### Referenzen (3)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Referenz-Platzhalter. Echte Events mit Freigabe der Kunden von Celia | [{"title":"Winter Gala","meta":"Firmenfeier · 280 Gäste","media":"gala-tafel-… | `home.highlights.items` | 1 |
| Referenzen nur nach Freigabe der Beteiligten (Yami Club, JD Sports o. ä.) | [{"name":"Club-Collective (z. B. Yami Club)","text":"Event-Recaps und Line-up… | `socialMedia.references` | 1 |
| Referenzen: klären, ob „kcee“ ein Kunde ist | „kcee“ – Kunde oder Partner? | `briefing.organisation.clientKcee` | 1 |

### Technik & Konten (8)

| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |
|---|---|---|---|
| Domain: vorhanden? Anbieter, Login, Wunsch-Domain für den neuen Namen | cn-event.de | `brand.domain` | 1 |
| Alte Website, Hosting, Vertragslaufzeit | Keine bekannt | `briefing.accounts.oldWebsite` | 1 |
| E-Mail-Anbieter | Bestehendes Postfach behalten, MX-Einträge beim Umzug sichern | `briefing.accounts.mailProvider` | 1 |
| Kalender-Tool und was öffentlich sichtbar sein darf | Öffentliche iCal-URL nur mit Frei/Belegt | `briefing.accounts.calendarTool` | 1 |
| Umfang des Admin-Dashboards | Anfragen, Mails, Posts, Rezensionen, Kalender | `briefing.accounts.adminScope` | 1 |
| Instagram-Account-Typ und Login (Basic Display API seit 4.12.2024 abgeschaltet) | Business- oder Creator-Account mit Instagram Login (Graph API) | `briefing.accounts.instagramType` | 1 |
| Google-Unternehmensprofil und verifizierter Inhaber | Profil anlegen bzw. übernehmen, Place-ID hinterlegen | `briefing.accounts.googleProfile` | 1 |
| Anbindung eigener Tools (CRM, Buchhaltung …) | Keine | `briefing.accounts.ownTools` | 1 |
