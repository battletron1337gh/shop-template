# 📁 Projecten Overzicht

Complete lijst van alle projecten, websites, templates en tools in deze workspace.

---

## 🚀 Actieve Projecten

### 1. TaxiBoek - Taxi Boekhouding SaaS
**Locatie:** `/home/battletron/.openclaw/workspace/taxi-admin/`  
**Status:** ✅ Compleet & Productie-ready  
**Details:** `memory/TAXIBOEK_PROJECT.md`

**Stack:**
- NestJS backend met PostgreSQL
- Next.js frontend
- React Native mobile app
- Stripe abonnementen
- AI bonnetjes-verwerking
- BTW rapportage

**URLs:**
- API: http://localhost:3000/api/v1
- Web: http://localhost:3001

---

### 2. Carstore Cuijk - Website
**Locatie:** `/home/battletron/.openclaw/workspace/carstorecuijk-v2/`  
**Status:** ✅ Live & Geüpdatet  
**Aangemaakt:** 25 Maart 2026 01:54

**Features:**
- Dark theme design
- Next.js 16 + TypeScript
- Statische export (SEO-friendly)
- Responsive met Framer Motion animaties
- Occasions overzicht + detail pagina's
- Onderhoud & service pagina
- Reviews carousel
- Contact formulier
- WhatsApp integratie

**URLs:**
- Tailscale: http://100.101.18.120:3002
- Hostname: http://battletron-EliteMini-Series:3002

**Belangrijke bestanden:**
- `src/components/Hero.tsx` - Landing sectie
- `src/components/FeaturedCars.tsx` - Uitgelichte occasions
- `src/components/ReviewMarquee.tsx` - Reviews carousel
- `src/data/cars.ts` - Auto data

---

### 3. Noah Kappers - Flyer Template
**Locatie:** `/home/battletron/.openclaw/workspace/noah-kappers/`  
**Status:** ✅ Klaar voor gebruik  
**Aangemaakt:** 25 Maart 2026

**Deliverables:**
- `output/noah-kappers-voorkant.png` - A4 flyer voorkant
- `output/noah-kappers-achterkant.png` - A4 flyer achterkant
- `output/noah-kappers-preview.png` - Preview beide kanten
- `generate_flyer.py` - Python script om flyers te genereren
- `flyer.html` / `flyer-v2.html` - Web versies

**Design:**
- Beige/crème achtergrond (#E8E2D9)
- Playfair Display font voor titels
- Openingstijden + diensten met prijzen
- QR code placeholder
- Donkere footer met contact

---

## 📦 Templates

### Webshop Templates
| Template | Locatie | Beschrijving |
|----------|---------|--------------|
| Shop Template Clean | `shop-template-clean/` | Clean e-commerce template |
| Webshop Template | `webshop-template/` | Algemene webshop |
| Heel Gezin Collection | `collection-heel-gezin.html` | Familie collectie pagina |
| Moeder Dochter | `collection-moeder-dochter.html` | Thema collectie |
| Vader Dochter | `collection-vader-dochter.html` | Thema collectie |
| Vader Zoon | `collection-vader-zoon.html` | Thema collectie |
| Product Denim | `product-denim-shirt.html` | Product detail pagina |
| Product Kersttrui | `product-kersttrui.html` | Product detail pagina |
| Algemeen Product | `product.html` | Standaard product pagina |

### Dienstverlening Templates
| Template | Locatie | Beschrijving |
|----------|---------|--------------|
| Stoelairbag | `stoelairbag-template/` | Stoel/airbag service site |
| Taxi Sprint | `taxi-sprint-template/` | Taxi website template |
| WY Cleaning v1 | `wycleaning-website/` | Cleaning service site |
| WY Cleaning v2 | `wycleaning-website-v2/` | Geüpdatete versie |
| Koplampen Polijsten | `KoplampenPolijsten/` | Auto detailing service |
| Auto Marktanalyse | `auto-marktanalyse/` | Marktanalyse tool |

---

## 🔧 Tools & Utilities

### AutoAd Generator
**Locatie:** `autoad-generator/`  
**Doel:** Genereert advertenties voor occasions

---

## 📚 Documentatie

### Core Bestanden
| Bestand | Doel |
|---------|------|
| `AGENTS.md` | Workspace regels & richtlijnen |
| `SOUL.md` | Assistant persoonlijkheid |
| `USER.md` | Gebruiker informatie |
| `TOOLS.md` | Lokale tool notities |
| `MEMORY.md` | Long-term memory |
| `AI_PROMPTS.md` | AI prompts collectie |

### Project Documentatie
- `memory/TAXIBOEK_PROJECT.md` - TaxiBoek details
- `memory/2026-03-25.md` - Dagelijkse logs

---

## 🔄 Snelle Commando's

### Carstore Cuijk starten
```bash
cd /home/battletron/.openclaw/workspace/carstorecuijk-v2/dist
python3 -m http.server 3002 --bind 0.0.0.0
```

### TaxiBoek starten
```bash
# Database
cd /home/battletron/.openclaw/workspace/taxi-admin
docker compose up -d postgres redis

# API
cd apps/api && npm run start:dev

# Web
cd apps/web && npm run dev
```

### Noah Kappers flyer genereren
```bash
cd /home/battletron/.openclaw/workspace/noah-kappers
python3 generate_flyer.py
```

---

## 📊 Project Status Overzicht

| Project | Status | Laatst Bijgewerkt | Prioriteit |
|---------|--------|-------------------|------------|
| TaxiBoek | ✅ Productie | 25 Maart 2026 | Hoog |
| Carstore Cuijk | ✅ Live | 25 Maart 2026 | Hoog |
| Noah Kappers | ✅ Klaar | 25 Maart 2026 | Normaal |
| Webshop Templates | ✅ Klaar | - | Laag |

---

## 📝 Notities

- Alle projecten gebruiken Git voor versiebeheer
- Templates zijn herbruikbaar voor toekomstige klanten
- Backup belangrijke wijzigingen regelmatig
- Documenteer belangrijke beslissingen in MEMORY.md

---

*Laatst bijgewerkt: 25 Maart 2026*  
*Volgende review: Bij nieuw project of significante wijziging*
