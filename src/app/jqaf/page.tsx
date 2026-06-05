import { getStudents } from "@/lib/data";
import { StudentsView } from "@/components/modules/students-view";

export const dynamic = "force-dynamic";

export const metadata = { title: "JQAF — MyPI Command Center" };

export default async function JqafPage() {
  const students = await getStudents();
  return <StudentsView initialStudents={students} focus="jqaf" />;
}
