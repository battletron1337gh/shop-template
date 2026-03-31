// GOOGLE REVIEWS - Car Store Cuijk
// =================================
// Instructies om echte reviews toe te voegen:
// 
// 1. Ga naar: https://www.google.com/search?q=car+store+cuijk+reviews
// 2. Klik op "Reviews" of scroll naar het reviewgedeelte
// 3. Kopieer per review:
//    - Naam van de reviewer
//    - Aantal sterren (1-5)
//    - Datum (bijv. "2 weken geleden" of "15 jan 2025")
//    - Review tekst
// 4. Plak hieronder in hetzelfde formaat
//
// TIP: Je kunt ook een Google Places API key gebruiken voor automatische sync
// maar dat vereist een server (werkt niet op GitHub Pages)

export interface Review {
  id: string;
  naam: string;
  beoordeling: string;
  sterren: number; // 1-5
  datum: string; // YYYY-MM-DD formaat
  auto?: string; // Optioneel: welke auto gekocht
}

// VERVANG DEZE PLACEHOLDERS MET ECHTE GOOGLE REVIEWS
export const googleReviews: Review[] = [
  {
    id: "g1",
    naam: "[NAAM VAN GOOGLE REVIEW]",
    beoordeling: "[TEKST VAN DE REVIEW]",
    sterren: 5,
    datum: "2025-03-15",
  },
  // Kopieer hier meer reviews...
];

// Totale stats (update na het toevoegen van reviews)
export const reviewStats = {
  gemiddelde: 4.9, // Update dit
  totaal: 47,      // Update dit met echte aantal
  verdeling: {
    vijfSterren: 45,
    vierSterren: 2,
    drieSterren: 0,
    tweeSterren: 0,
    eenSter: 0,
  }
};

// Google review link (voor "Schrijf een review" knop)
export const googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJn09CtNR1x0cR0Dj28vR_PxM";
