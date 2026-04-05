import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "dream to move | Tasima Talep MVP",
  description: "Tasima taleplerini toplayan ve admin tarafinda yoneten Next.js + Prisma MVP uygulamasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
