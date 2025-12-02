import { CollapsibleWidget } from "./CollapsibleWidget";
import { TrendingUp, Calendar } from "lucide-react";

interface ReadingPatternsData {
  timeOfDay: Record<string, { count: number; totalPages: number; totalDuration: number }>;
  weekdays: Record<number, { count: number; totalPages: number; totalDuration: number }>;
  bestTimeOfDay: string | null;
  favoriteWeekday: number | null;
}

interface ReadingPatternsWidgetProps {
  patterns: ReadingPatternsData;
  defaultCollapsed?: boolean;
}

export function ReadingPatternsWidget({ patterns, defaultCollapsed = false }: ReadingPatternsWidgetProps) {
  const timeOfDayLabels: Record<string, string> = {
    MORNING: "Morgen",
    AFTERNOON: "Mittag",
    EVENING: "Abend",
    NIGHT: "Nacht",
  };

  const timeOfDayEmojis: Record<string, string> = {
    MORNING: "🌅",
    AFTERNOON: "☀️",
    EVENING: "🌆",
    NIGHT: "🌙",
  };

  const weekdayLabels = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  const hasSessions = Object.keys(patterns.timeOfDay).length > 0 || Object.keys(patterns.weekdays).length > 0;

  return (
    <CollapsibleWidget
      title="Lesemuster"
      icon={<TrendingUp className="h-5 w-5" />}
      defaultCollapsed={defaultCollapsed}
    >
      {!hasSessions ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Noch keine Lesemuster vorhanden</p>
          <p className="text-sm mt-1">Starte eine Lese-Session, um Muster zu erkennen</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Best Time of Day */}
          {patterns.bestTimeOfDay && (
            <div className="bg-gradient-to-br from-primary-light/20 to-accent-light/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {timeOfDayEmojis[patterns.bestTimeOfDay]}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beste Lesezeit</p>
                  <p className="text-xl font-bold text-foreground">
                    {timeOfDayLabels[patterns.bestTimeOfDay]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {patterns.timeOfDay[patterns.bestTimeOfDay].count} Sessions
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Favorite Weekday */}
          {patterns.favoriteWeekday !== null && (
            <div className="bg-gradient-to-br from-accent-light/20 to-primary-light/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lieblings-Wochentag</p>
                  <p className="text-xl font-bold text-foreground">
                    {weekdayLabels[patterns.favoriteWeekday]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {patterns.weekdays[patterns.favoriteWeekday].count} Sessions
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Time of Day Breakdown */}
          {Object.keys(patterns.timeOfDay).length > 1 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Tageszeit-Verteilung</p>
              <div className="space-y-2">
                {Object.entries(patterns.timeOfDay)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([time, data]) => (
                    <div key={time} className="flex items-center gap-2">
                      <span className="text-sm w-20">{timeOfDayEmojis[time]} {timeOfDayLabels[time]}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(data.count / Math.max(...Object.values(patterns.timeOfDay).map((d) => d.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{data.count}x</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CollapsibleWidget>
  );
}
