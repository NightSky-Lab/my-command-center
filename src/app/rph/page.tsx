import type { Metadata } from "next";
import { getAiCategories, getAiPrompts } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { AiHubView } from "@/components/modules/ai-hub-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RPH Saya" };

export default async function RphPage() {
  const [categories, prompts] = await Promise.all([
    getAiCategories(),
    getAiPrompts(),
  ]);
  const rph =
    categories.find((c) => c.name.toLowerCase().includes("rph")) ??
    categories[0];
  const rphPrompts = rph
    ? prompts.filter((p) => p.category_id === rph.id)
    : prompts;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="RPH Saya"
        description="Templat & prompt AI untuk menjana Rancangan Pengajaran Harian."
        icon="BookOpen"
      />
      <AiHubView categories={rph ? [rph] : []} prompts={rphPrompts} />
    </div>
  );
}
