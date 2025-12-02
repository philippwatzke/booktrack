import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleWidgetProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export function CollapsibleWidget({
  title,
  icon,
  children,
  defaultCollapsed = false,
  className,
}: CollapsibleWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Card className={cn("rounded-2xl border-border shadow-md overflow-hidden transition-all break-inside-avoid", className)}>
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-all",
          isCollapsed ? "p-3" : "p-4"
        )}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h3 className={cn(
            "font-semibold text-foreground transition-all",
            isCollapsed ? "text-base" : "text-lg"
          )}>{title}</h3>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </Card>
  );
}
