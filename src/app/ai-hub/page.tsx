import type { Metadata } from "next";
import {
  getAiCategories,
  getAiPrompts,
  getStudents,
  getPrograms,
  getTasks,
  getDocuments,
} from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { AiHubTabs } from "@/components/modules/ai-hub-tabs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "AI Assistant" };

export default async function AiHubPage() {
  const [categories, prompts, students, programs, tasks, documents] = await Promise.all([
    getAiCategories(),
    getAiPrompts(),
    getStudents(),
    getPrograms(),
    getTasks(),
    getDocuments(),
  ]);
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Assistant"
        description="Tanya soalan tentang data anda, atau guna pustaka prompt AI siap pakai."
        icon="Sparkles"
      />
      <AiHubTabs data={{ students, programs, tasks, documents }} categories={categories} prompts={prompts} />
    </div>
  );
}
