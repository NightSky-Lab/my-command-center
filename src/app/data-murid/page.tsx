import { getStudents } from "@/lib/data";
import { StudentsView } from "@/components/modules/students-view";

export const dynamic = "force-dynamic";

export const metadata = { title: "Data Murid — MyPI Command Center" };

export default async function DataMuridPage() {
  const students = await getStudents();
  return <StudentsView initialStudents={students} focus="murid" />;
}
