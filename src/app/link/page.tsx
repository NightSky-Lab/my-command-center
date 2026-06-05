import type { Metadata } from "next";
import { getQuickLinks } from "@/lib/data";
import { DriveLinks } from "@/components/modules/drive-links";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Google Drive & Pautan" };

export default async function LinkPage() {
  const links = await getQuickLinks();
  return <DriveLinks initial={links} />;
}
