import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VigiParl — Observatoire des conditions de travail parlementaires",
  description:
    "Plateforme anonyme de collecte de témoignages sur les conditions de travail des collaborateurs parlementaires (Assemblée nationale, Sénat, Parlement européen).",
  openGraph: {
    title: "VigiParl",
    description: "La transparence commence dans les bureaux",
    url: "https://vigiparl.cavaparlement.eu",
    siteName: "VigiParl",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="noise min-h-screen">{children}</body>
    </html>
  );
}
