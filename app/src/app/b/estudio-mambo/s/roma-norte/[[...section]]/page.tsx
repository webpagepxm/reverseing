import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Workspace } from "../../../../../../components/workspace";
import { modules, scope } from "../../../../../../lib/navigation";

export default async function Page({ params }: { params: Promise<{ section?: string[] }> }) {
  const { section = [] } = await params;
  const route = section.join("/");
  if (!route) redirect(scope + "/agenda");
  if (!modules.some((group) => group.sections.some((item) => item.href === route))) notFound();
  return (
    <Suspense fallback={<p role="status" className="initial-loading">Cargando Mambo Jambo…</p>}>
      <Workspace route={route} />
    </Suspense>
  );
}
