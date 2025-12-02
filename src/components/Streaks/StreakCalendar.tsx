import { Card } from "@/components/ui/card";
import { useDailyLogs } from "@/hooks/useStreak";
import { useMemo } from "react";

export function StreakCalendar() {
  // Get logs for last 12 weeks (84 days)
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 83); // 12 weeks = 84 days
    return date.toISOString().split('T')[0];
  }, []);

  const endDate = useMemo(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }, []);

  const { data: logs = [], isLoading } = useDailyLogs({ startDate, endDate });

  const calendarData = useMemo(() => {
    const logMap = new Map(logs.map(log => [log.date, log]));
    const weeks: { date: string; pagesRead: number; duration: number }[][] = [];

    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 83);

    // Adjust start to Monday
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    start.setDate(start.getDate() - diff);

    let currentWeek: { date: string; pagesRead: number; duration: number }[] = [];

    for (let i = 0; i < 84; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const log = logMap.get(dateStr);

      currentWeek.push({
        date: dateStr,
        pagesRead: log?.pagesRead || 0,
        duration: log?.duration || 0,
      });

      if ((i + 1) % 7 === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [logs]);

  const getIntensityColor = (pagesRead: number): string => {
    if (pagesRead === 0) return 'bg-muted';
    if (pagesRead < 10) return 'bg-green-200 dark:bg-green-900/40';
    if (pagesRead < 25) return 'bg-green-400 dark:bg-green-700/60';
    if (pagesRead < 50) return 'bg-green-600 dark:bg-green-500/80';
    return 'bg-green-800 dark:bg-green-400';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} Min.`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md break-inside-avoid">
        <h3 className="text-xl font-bold text-foreground mb-4">Lese-Aktivität</h3>
        <div className="animate-pulse flex gap-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="aspect-square bg-muted rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md break-inside-avoid">
      <h3 className="text-xl font-bold text-foreground mb-4">Lese-Aktivität (letzte 12 Wochen)</h3>

      <div className="flex gap-1">
        {/* Week day labels */}
        <div className="flex flex-col gap-1 pr-2">
          {weekDays.map((day, i) => (
            <div
              key={day}
              className="text-xs text-muted-foreground h-3 flex items-center"
              style={{ height: 'calc((100% - 24px) / 7)' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1 flex-1 min-w-[20px]">
              {week.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className={`aspect-square rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-primary ${getIntensityColor(day.pagesRead)}`}
                  title={`${formatDate(day.date)}\n${day.pagesRead} Seiten gelesen\n${formatDuration(day.duration)}`}
                  style={{ minWidth: '12px', minHeight: '12px' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Weniger</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700/60"></div>
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500/80"></div>
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-400"></div>
        </div>
        <span>Mehr</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Tage aktiv</p>
          <p className="text-2xl font-bold text-foreground">
            {logs.filter(log => log.pagesRead > 0).length}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gesamt Seiten</p>
          <p className="text-2xl font-bold text-foreground">
            {logs.reduce((sum, log) => sum + log.pagesRead, 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gesamt Zeit</p>
          <p className="text-2xl font-bold text-foreground">
            {formatDuration(logs.reduce((sum, log) => sum + log.duration, 0))}
          </p>
        </div>
      </div>
    </Card>
  );
}
