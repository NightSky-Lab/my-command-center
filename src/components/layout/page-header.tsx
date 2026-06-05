import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

export function PageHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Icon name={icon} className="size-6" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
