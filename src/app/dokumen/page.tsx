import type { Metadata } from "next";
import { getDocuments } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { DocumentsView } from "@/components/modules/documents-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dokumen" };

export default async function DokumenPage() {
  const documents = await getDocuments();
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Pengurusan Dokumen"
        description="Semua dokumen panitia — minit mesyuarat, kertas kerja, takwim & analisis."
        icon="FolderClosed"
      />
      <DocumentsView documents={documents} />
    </div>
  );
}
