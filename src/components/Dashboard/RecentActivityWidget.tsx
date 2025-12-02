import { CollapsibleWidget } from "./CollapsibleWidget";
import { Clock, FileText, Quote as QuoteIcon, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  type: "session" | "note" | "quote";
  createdAt: string;
  book: {
    id: string;
    title: string;
    coverUrl?: string;
  };
  // Session fields
  duration?: number;
  pagesRead?: number;
  // Note fields
  content?: string;
  // Quote fields
  text?: string;
}

interface RecentActivityWidgetProps {
  activities: Activity[];
  defaultCollapsed?: boolean;
}

export function RecentActivityWidget({ activities, defaultCollapsed = false }: RecentActivityWidgetProps) {
  const navigate = useNavigate();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "session":
        return <Clock className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      case "quote":
        return <QuoteIcon className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (activity: Activity) => {
    switch (activity.type) {
      case "session":
        return `${formatDuration(activity.duration || 0)} gelesen • ${activity.pagesRead || 0} Seiten`;
      case "note":
        return activity.content?.slice(0, 50) + (activity.content && activity.content.length > 50 ? "..." : "");
      case "quote":
        return activity.text?.slice(0, 50) + (activity.text && activity.text.length > 50 ? "..." : "");
      default:
        return "";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Gerade eben";
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)}min`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `vor ${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  return (
    <CollapsibleWidget
      title="Letzte Aktivität"
      icon={<BookOpen className="h-5 w-5" />}
      defaultCollapsed={defaultCollapsed}
    >
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Noch keine Aktivität vorhanden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              onClick={() => navigate(`/book/${activity.book.id}`)}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.book.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {getActivityLabel(activity)}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {getTimeAgo(activity.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </CollapsibleWidget>
  );
}
