import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FAF9F5',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sendtheayat.pages.dev'),
  title: "KirimAyat - Pesan Personal Ayat Al-Qur'an",
  description: "Kirimkan ayat Al-Qur'an penuh makna dan ketenangan disertai pesan personal untuk orang tersayang.",
  openGraph: {
    title: "KirimAyat - Pesan Personal Ayat Al-Qur'an",
    description: "Kirimkan ayat Al-Qur'an penuh makna dan ketenangan disertai pesan personal untuk orang tersayang.",
    type: 'website',
    images: [
      {
        url: '/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'KirimAyat - Pesan Personal Ayat Al-Qur\'an',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KirimAyat - Pesan Personal Ayat Al-Qur'an",
    description: "Kirimkan ayat Al-Qur'an penuh makna dan ketenangan disertai pesan personal untuk orang tersayang.",
    images: ['/og-cover.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#FAF9F5] text-zinc-800 antialiased selection:bg-emerald-800/10 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
