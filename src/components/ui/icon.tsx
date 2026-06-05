import { icons, HelpCircle, type LucideProps } from "lucide-react";

/**
 * Renders a Lucide icon by its PascalCase name (e.g. "FileText").
 * Falls back to HelpCircle for unknown names so the CMS can store any string.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp =
    (icons as Record<string, React.ComponentType<LucideProps>>)[name] ??
    HelpCircle;
  return <Cmp {...props} />;
}
