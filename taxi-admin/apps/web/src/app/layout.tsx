import './globals.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="antialiased bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
