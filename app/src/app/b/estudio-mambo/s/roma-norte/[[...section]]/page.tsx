import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Workspace } from "../../../../../../components/workspace";
import { modules } from "../../../../../../lib/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { section: [] },
    ...modules.flatMap((group) => group.sections.map((item) => ({ section: item.href.split("/") }))),
  ];
}

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  const route = section.length ? section.join("/") : "agenda";
  if (!modules.some((group) => group.sections.some((item) => item.href === route))) notFound();
  return (
    <Suspense fallback={<p role="status" className="initial-loading">Cargando Mambo Jambo…</p>}>
      <Workspace route={route} />
    </Suspense>
  );
}
