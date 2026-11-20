import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/fraunces/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mambo Jambo · Estudio Mambo",
  other: { "mambo-revision": process.env.NEXT_PUBLIC_MAMBO_REVISION ?? "local" },
  description: "Entorno de demostración de Mambo Jambo",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
