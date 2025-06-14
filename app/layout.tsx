import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { TailwindIndicator } from "@/components/setting/tailwind-indicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PongMaster - Le jeu de Pong professionnel",
    template: "%s | PongMaster"
  },
  description: "Jouez au Pong en ligne, participez à des tournois multijoueurs et suivez votre progression ELO. Le meilleur jeu de Pong compétitif avec classement et profils personnalisés.",
  keywords: ["pong", "jeu multijoueur", "tournois pong", "jeu de raquette", "classement ELO", "jeu en ligne"],
  authors: [{ name: "Votre Nom", url: "https://votre-site.com" }],
  creator: "Votre Nom",
  publisher: "Votre Société",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://votre-site.com"),
  openGraph: {
    title: "PongMaster - Le jeu de Pong professionnel",
    description: "Jouez au Pong en ligne, participez à des tournois multijoueurs et suivez votre progression ELO.",
    url: "https://votre-site.com",
    siteName: "PongMaster",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PongMaster - Capture d'écran du jeu",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PongMaster - Le jeu de Pong professionnel",
    description: "Jouez au Pong en ligne, participez à des tournois multijoueurs et suivez votre progression ELO.",
    images: ["/og-image.jpg"],
    creator: "@votrecompte",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "votre-code-verification-google",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <TailwindIndicator />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
              description: 'group-[.toast]:text-muted-foreground',
              actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
              cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
            },
          }}
        />
      </body>
    </html>
  );
}
