"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { scope } from "../lib/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(scope + "/agenda");
  }, [router]);

  return (
    <main style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>MAMBO JAMBO</h1>
      <p>Abriendo la agenda de demostración…</p>
      <Link href={scope + "/agenda"}>Entrar a MAMBO JAMBO</Link>
    </main>
  );
}
