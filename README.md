# HONIG IDING & Partners — redesign

Moderne redesign van [honig-iding.nl](https://honig-iding.nl), een fiscaal advieskantoor voor ondernemingen en eigenaren (Breukelen & Driebergen-Rijsenburg, lid NOB).

## Richting
Editorial / premium advisory. Diep marineblauw (#0E2A47) met een brass-goud accent (#B0894C) op een warme bone-achtergrond. Fraunces (display serif) gekoppeld aan Hanken Grotesk (body). Rustig, autoritair en discreet, passend bij een belastingadvieskantoor.

## Pagina's
- `index.html` — Home (hero, trust-strook, welkom, diensten-preview, statement, team, NOB, contact-CTA)
- `diensten.html` — Alle 6 diensten uitgewerkt + documenten
- `over-ons.html` — Kantoor, waarden, team (Laurens Honig & Bram Iding), bedrijfsgegevens
- `contact.html` — Contactgegevens, werkend formulier (mailto), locatiekaart

## Behouden uit het origineel
- Alle diensten, de NOB-tekst, beide adressen, telefoon, e-mail, KvK- en BTW-nummer
- De echte foto's van Laurens Honig en Bram Iding, het originele logo (op de Over ons-pagina)
- De PDF's (algemene voorwaarden + privacy statement) in `docs/`
- LinkedIn-links van beide partners

## Toegevoegd
- Volledig nieuw, responsive design met GSAP/Lenis animaties (SplitText reveals, parallax, magnetische knoppen, custom cursor)
- LocalBusiness (AccountingService) schema.org, OG-tags, print-stylesheet
- Werkend contactformulier via mailto, locatiekaart met doorlink naar Google Maps

## Techniek
Geen build-stap. Gedeelde `assets/style.css` en `assets/main.js`, libraries via CDN (GSAP, Lenis, Google Fonts). `prefers-reduced-motion` respecteert bewegingsvoorkeuren.

## Lokaal draaien
```bash
node serve.mjs           # vanuit de map "Claude code"
# open http://localhost:3000/honig-iding/index.html
```

## Let op
De teksten in de dienstbeschrijvingen zijn een nette uitwerking van de originele dienstenlijst. Controleer ze en de bedrijfsgegevens voordat de site echt live gaat.
