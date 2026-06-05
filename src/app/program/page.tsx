import type { Metadata } from "next";
import { getPrograms } from "@/lib/data";
import { ProgramsView } from "@/components/modules/programs-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Program & Aktiviti" };

export default async function ProgramPage() {
  const programs = await getPrograms();
  return <ProgramsView initial={programs} />;
}
