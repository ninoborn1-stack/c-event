import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Archivo, Cormorant_Garamond, DM_Sans, Press_Start_2P } from 'next/font/google';
import { brand, home, listPlaceholders, tokens, tokensToCss } from '@c-event/content';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { DemoBadge } from '@/components/layout/DemoBadge';
import { PwaRegister } from '@/components/layout/PwaRegister';
import { Curtain } from '@/components/motion/Curtain';
import { Reveals } from '@/components/motion/Reveals';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { RiderDrawer } from '@/components/rider/RiderDrawer';
import { JsonLd } from '@/components/JsonLd';
import { asset, IS_DEMO, SITE_URL } from '@/lib/env';
import { organizationLd } from '@/lib/seo';
import { SiteProvider } from '@/lib/site-context';
import { getSettings } from '@/server/services';
import './globals.css';

// Schriften werden von Next beim Build heruntergeladen und selbst ausgeliefert (kein Google-Aufruf im Browser).
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--ff-display', display: 'swap' });
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['italic', 'normal'], variable: '--ff-serif', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], variable: '--ff-sans', display: 'swap' });
// Pixel-Schrift nur für die Arcade; kein Preload, damit sie die übrigen Seiten nicht bremst.
const pixel = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--ff-pixel', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name} · ${home.seo.title}`, template: `%s | ${brand.name}` },
  description: home.seo.description,
  applicationName: brand.name,
  robots: IS_DEMO ? { index: false, follow: false } : { index: true, follow: true },
  appleWebApp: { capable: true, title: brand.short, statusBarStyle: 'black-translucent' },
  icons: { icon: asset('/icons/icon-192.png'), apple: asset('/icons/apple-touch-icon.png') },
};

export const viewport: Viewport = { themeColor: tokens.color.ink, width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const phCount = IS_DEMO ? listPlaceholders().length : 0;
  return (
    <html
      lang="de"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${pixel.variable}`}
      data-ph={IS_DEMO && settings.showPlaceholders ? 'on' : 'off'}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
        {/* Zurück/Neuladen: keine wiederhergestellte Scrollposition mitten im Hero-Intro */}
        <Script id="boot" strategy="beforeInteractive">
          {`try{if('scrollRestoration' in history&&!location.hash)history.scrollRestoration='manual';document.documentElement.classList.add('js')}catch(e){}`}
        </Script>
        <JsonLd data={organizationLd()} />
        <noscript>
          <style>{'.intro{display:none!important}.hero.is-intro .ch,.hero.is-intro .hero__eyebrow>*,.hero.is-intro .hero__foot>*,.hero.is-intro .hero__bar-in{transform:none!important;opacity:1!important}'}</style>
        </noscript>
      </head>
      <body>
        <SiteProvider value={{ settings, isDemo: IS_DEMO }}>
          <a href="#main" className="skip">
            Zum Inhalt
          </a>
          <Curtain />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <RiderDrawer />
          <SmoothScroll />
          <Reveals />
          <PwaRegister />
          {IS_DEMO && <DemoBadge placeholders={phCount} />}
          <div className="grain" aria-hidden="true" />
        </SiteProvider>
      </body>
    </html>
  );
}
