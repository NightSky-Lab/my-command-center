import type { Metadata } from "next";
import { getCalendarEvents } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { CalendarView } from "@/components/modules/calendar-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kalendar" };

export default async function KalendarPage() {
  const events = await getCalendarEvents();
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Kalendar Takwim"
        description="Jadual program, mesyuarat & tarikh penting panitia."
        icon="Calendar"
      />
      <CalendarView events={events} />
    </div>
  );
}
