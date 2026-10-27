import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/poetry/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vers lents — Poésie d'amour",
  description:
    "Un recueil vivant de poèmes d'amour : passion, douceur, nostalgie, déclarations. Lisez, aimez, partagez vos propres vers.",
  keywords: [
    "poésie",
    "amour",
    "poème",
    "recueil",
    "littérature",
    "vers",
    "romantique",
  ],
  authors: [{ name: "Vers lents" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Vers lents — Poésie d'amour",
    description:
      "Un recueil vivant de poèmes d'amour, du vers passionné à la douce déclaration.",
    siteName: "Vers lents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/*
          Force le thème clair par défaut.
          On efface l'ancienne préférence "dark" héritée de la version
          précédente du site, puis on pose explicitement "light" avant
          le premier paint pour éviter tout flash visuel.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){localStorage.setItem('theme','light');}var r=document.documentElement;r.classList.remove('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
