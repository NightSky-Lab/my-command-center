import { Skeleton } from "@/components/ui/skeleton";

/**
 * Instant loading skeleton — shown the moment a user navigates, before the
 * page's data finishes loading. Next.js renders this automatically during
 * route transitions (and prefetches it on hover), so clicking a menu item
 * gives immediate visual feedback instead of a blank "hanging" wait.
 */
export default function Loading() {
  return (
    <div className="space-y-5 animate-fade-in" aria-busy="true" aria-label="Memuatkan…">
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-xl" />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 space-y-5 xl:col-span-8">
          <Skeleton className="h-72 rounded-xl" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
        <div className="col-span-12 space-y-5 xl:col-span-4">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
