import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Santiago Camiro Gallery - STUFFS.NYC',
  description: 'Artist Santiago Camiro\'s product catalog featuring artwork, posters, and collectibles through STUFFS.NYC marketplace.',
  keywords: 'Santiago Camiro, artist, gallery, posters, artwork, STUFFS.NYC, contemporary art',
  authors: [{ name: 'Santiago Camiro' }],
  creator: 'Santiago Camiro',
  publisher: 'STUFFS.NYC',
  openGraph: {
    title: 'Santiago Camiro Gallery - STUFFS.NYC',
    description: 'Artist Santiago Camiro\'s product catalog featuring artwork, posters, and collectibles.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Santiago Camiro Gallery'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Santiago Camiro Gallery - STUFFS.NYC',
    description: 'Artist Santiago Camiro\'s product catalog featuring artwork, posters, and collectibles.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MSHKF09KLV"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MSHKF09KLV');
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#030213" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}