import { CollapsibleWidget } from "./CollapsibleWidget";
import { Calendar, Clock, BookOpen, TrendingUp } from "lucide-react";

interface MonthlyReportData {
  month: number;
  year: number;
  totalSessions: number;
  totalDuration: number;
  totalPages: number;
  booksFinished: number;
}

interface MonthlyReportWidgetProps {
  data: MonthlyReportData;
  defaultCollapsed?: boolean;
}

export function MonthlyReportWidget({ data, defaultCollapsed = false }: MonthlyReportWidgetProps) {
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const monthName = monthNames[data.month - 1];

  return (
    <CollapsibleWidget
      title={`${monthName} ${data.year}`}
      icon={<Calendar className="h-5 w-5" />}
      defaultCollapsed={defaultCollapsed}
    >
      {data.totalSessions === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Noch keine Sessions in diesem Monat</p>
          <p className="text-sm mt-1">Starte eine Lese-Session!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Highlight Card */}
          <div className="bg-gradient-to-br from-primary-light/20 to-accent-light/20 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Gelesene Seiten</p>
            <p className="text-4xl font-bold text-primary">{data.totalPages}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <BookOpen className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{data.booksFinished}</p>
              <p className="text-xs text-muted-foreground">Bücher</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{data.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {formatDuration(data.totalDuration)}
              </p>
              <p className="text-xs text-muted-foreground">Zeit</p>
            </div>
          </div>

          {/* Average Stats */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">⌀ Seiten pro Session</span>
              <span className="font-semibold text-foreground">
                {Math.round(data.totalPages / data.totalSessions)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">⌀ Dauer pro Session</span>
              <span className="font-semibold text-foreground">
                {formatDuration(Math.round(data.totalDuration / data.totalSessions))}
              </span>
            </div>
            {data.totalDuration > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Lesegeschwindigkeit</span>
                <span className="font-semibold text-foreground">
                  {Math.round((data.totalPages / data.totalDuration) * 3600)} S/h
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </CollapsibleWidget>
  );
}
