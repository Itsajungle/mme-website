import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 lg:py-28", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl mx-auto text-center mb-12 lg:mb-16", className)}>
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
