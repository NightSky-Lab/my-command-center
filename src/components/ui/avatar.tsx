import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex size-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-semibold text-brand-gold ring-2 ring-brand-gold/40",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="size-full object-cover" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
