// Placeholder reviews - vervang met echte Google reviews
// Bron: https://www.google.com/search?q=car+store+cuijk+reviews

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  text: string;
  avatar?: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    author: "Jan de Vries",
    rating: 5,
    date: "2 maanden geleden",
    text: "Geweldige service! Heb hier mijn auto gekocht en ben super tevreden. Goede uitleg en eerlijke prijs.",
  },
  {
    id: "2",
    author: "Maria Jansen",
    rating: 5,
    date: "4 maanden geleden",
    text: "Zeer professioneel bedrijf. Nette auto's en vriendelijk personeel. Zeker een aanrader!",
  },
  {
    id: "3",
    author: "Peter van den Berg",
    rating: 4,
    date: "6 maanden geleden",
    text: "Goede ervaring gehad bij aankoop van mijn tweedehands auto. Netjes geholpen.",
  },
  // VOEG HIER MEER REVIEWS TOE VAN GOOGLE
  // Instructies:
  // 1. Ga naar https://www.google.com/search?q=car+store+cuijk+reviews
  // 2. Klik op "Reviews"
  // 3. Kopieer per review: naam, sterren, datum, tekst
  // 4. Plak hieronder in hetzelfde formaat
];

export const averageRating = 4.8;
export const totalReviews = 45; // Update dit met het echte aantal
