# 📋 Instructies: Google Reviews Toevoegen

## Waar vind je de echte reviews?

1. **Open Google** en zoek: `car store cuijk reviews`
2. **Klik op "Reviews"** (rechts van het bedrijfsprofiel)
3. **Scroll** door de reviews en kopieer de informatie

## Hoe voeg je ze toe?

Open `/src/data/google-reviews.ts` en vervang de placeholders:

```typescript
export const googleReviews: Review[] = [
  {
    id: "g1",
    naam: "Jan de Vries",
    beoordeling: "Geweldige service! Mijn auto rijdt perfect.",
    sterren: 5,
    datum: "2025-03-20",
  },
  {
    id: "g2", 
    naam: "Maria Jansen",
    beoordeling: "Zeer tevreden over de aankoop. Eerlijke prijs!",
    sterren: 5,
    datum: "2025-03-15",
  },
  // etc...
];
```

## Update ook de stats

```typescript
export const reviewStats = {
  gemiddelde: 4.9,  // Het echte gemiddelde
  totaal: 47,       // Totaal aantal reviews
  // ...
};
```

## Automatisch (advanced)

Wil je reviews automatisch syncen? Je hebt dan nodig:
- Google Places API key
- Een server (Vercel, Netlify Functions, etc.)
- De huidige GitHub Pages setup heeft geen server

## Foto's van de website

Voor foto's van www.carstorecuijk.nl:
1. **Vraag toestemming** aan de eigenaar
2. Of maak zelf nieuwe foto's
3. Plaats ze in `/public/` map
4. Update de paths in de code

---

**Niet vergeten:** Na wijzigingen → `git add . && git commit -m "Reviews updated" && git push`
