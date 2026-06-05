import type { Metadata } from "next";
import { getEvidence } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { EvidenceGallery } from "@/components/modules/evidence-gallery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Evidens" };

export default async function EvidensPage() {
  const evidence = await getEvidence();
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Galeri Evidens"
        description="Koleksi gambar & video bukti pelaksanaan program panitia."
        icon="Camera"
      />
      <EvidenceGallery evidence={evidence} />
    </div>
  );
}
