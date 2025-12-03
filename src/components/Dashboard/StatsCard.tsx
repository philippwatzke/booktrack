import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "default" | "primary" | "accent";
  className?: string;
  style?: React.CSSProperties;
}

export function StatsCard({
  icon,
  label,
  value,
  subtext,
  variant = "default",
  className,
  style,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg",
        variant === "default" && "bg-card border border-border",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "accent" && "bg-gradient-to-br from-amber-warm to-secondary text-accent-foreground",
        className
      )}
      style={style}
    >
      {/* Decorative circle */}
      <div
        className={cn(
          "absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 transition-transform group-hover:scale-110",
          variant === "default" && "bg-primary",
          variant === "primary" && "bg-primary-foreground",
          variant === "accent" && "bg-background"
        )}
      />

      <div className="relative">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
            variant === "default" && "bg-primary/10 text-primary",
            variant === "primary" && "bg-primary-foreground/20 text-primary-foreground",
            variant === "accent" && "bg-background/20 text-accent-foreground"
          )}
        >
          {icon}
        </div>

        <p
          className={cn(
            "text-sm font-medium mb-1",
            variant === "default" && "text-muted-foreground",
            variant === "primary" && "text-primary-foreground/80",
            variant === "accent" && "text-accent-foreground/80"
          )}
        >
          {label}
        </p>

        <p className="text-3xl font-serif font-bold">{value}</p>

        {subtext && (
          <p
            className={cn(
              "text-xs mt-1",
              variant === "default" && "text-muted-foreground",
              variant === "primary" && "text-primary-foreground/60",
              variant === "accent" && "text-accent-foreground/60"
            )}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
