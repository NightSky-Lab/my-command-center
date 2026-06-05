import type { Metadata } from "next";
import { getDocuments, getQuickLinks } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { QuickLinks } from "@/components/dashboard/quick-links";
import { RecentDocuments } from "@/components/dashboard/recent-documents";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Rujukan" };

export default async function RujukanPage() {
  const [links, documents] = await Promise.all([
    getQuickLinks(),
    getDocuments(),
  ]);
  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Rujukan & Sumber"
        description="Pautan sistem rasmi & dokumen rujukan panitia."
        icon="Library"
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <QuickLinks links={links} />
        <RecentDocuments documents={documents} />
      </div>
    </div>
  );
}
