import { getAudit } from "@/lib/data";
import { AuditTrail } from "@/components/modules/audit-trail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit Trail" };

export default async function AuditPage() {
  const entries = await getAudit();
  return <AuditTrail entries={entries} />;
}
