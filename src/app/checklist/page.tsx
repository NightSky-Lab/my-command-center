import { getTasks } from "@/lib/data";
import { KanbanBoard } from "@/components/modules/kanban-board";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checklist Tugasan — MyPI Command Center" };

export default async function ChecklistPage() {
  const tasks = await getTasks();
  return <KanbanBoard initialTasks={tasks} />;
}
