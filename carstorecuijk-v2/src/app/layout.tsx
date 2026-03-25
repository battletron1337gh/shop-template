import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Car Store Cuijk | Occasions & Onderhoud",
  description: "Vind uw droomoccasion bij Car Store Cuijk. Ruim aanbod occasions, professioneel onderhoud en vakkundige reparaties. 7 dagen per week open.",
  keywords: "occasions, auto kopen, auto verkopen, onderhoud, APK, Cuijk, occasions Nederland",
  openGraph: {
    title: "Car Store Cuijk | Occasions & Onderhoud",
    description: "Vind uw droomoccasion bij Car Store Cuijk. Professioneel onderhoud en vakkundige reparaties.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
