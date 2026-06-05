import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  icon,
  iconClass = "text-brand-gold",
  href,
  hrefLabel = "Lihat Semua",
  children,
  className,
  bodyClassName,
}: {
  title: string;
  icon?: string;
  iconClass?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-foreground">
          {icon && <Icon name={icon} className={cn("size-[18px]", iconClass)} />}
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-gold"
          >
            {hrefLabel}
          </Link>
        )}
      </header>
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
