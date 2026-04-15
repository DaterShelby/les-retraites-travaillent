import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Les Retraités Travaillent — Votre expérience a de la valeur",
    template: "%s | Les Retraités Travaillent",
  },
  description:
    "La plateforme qui connecte les retraités actifs avec les particuliers et entreprises qui ont besoin de leur savoir-faire. Trouvez des missions adaptées à votre rythme.",
  keywords: [
    "retraités",
    "emploi senior",
    "cumul emploi retraite",
    "services seniors",
    "CDI valorisation expérience",
    "silver économie",
    "missions retraités",
  ],
  authors: [{ name: "Les Retraités Travaillent" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Les Retraités Travaillent",
    title: "Les Retraités Travaillent — Votre expérience a de la valeur",
    description:
      "Plateforme de mise en relation entre retraités actifs et demandeurs de services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${libreBaskerville.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
