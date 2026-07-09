import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explícamelo — Entiende cualquier tema al instante",
  description:
    "Escribe cualquier tema y recibe una explicación clara a nivel Peque, Adolescente o Experto, con analogía, fuentes y un mini quiz. Gratis, sin registro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body chalk-texture min-h-screen">{children}</body>
    </html>
  );
}
