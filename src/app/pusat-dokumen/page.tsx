import { getDocuments } from "@/lib/data";
import { DocumentBrowser } from "@/components/modules/document-browser";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pusat Dokumen" };

export default async function PusatDokumenPage() {
  const documents = await getDocuments();
  return (
    <DocumentBrowser
      documents={documents}
      title="Pusat Dokumen"
      description="Repositori dokumen utama — surat, minit mesyuarat, laporan, takwim & fail rasmi"
      iconName="Archive"
    />
  );
}
