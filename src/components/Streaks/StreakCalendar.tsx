import { Card } from "@/components/ui/card";
import { useDailyLogs } from "@/hooks/useStreak";
import { useBooks } from "@/hooks/useBooks";
import { useMemo } from "react";
import { BookOpen } from "lucide-react";

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
  const { data: books = [] } = useBooks();

  // DEBUG: Log what we receive
  console.log('🔍 StreakCalendar Debug:', {
    startDate,
    endDate,
    logsCount: logs.length,
    logs: logs,
    booksCount: books.length
  });

  // Create book map for quick lookup
  const bookMap = useMemo(() => {
    return new Map(books.map(book => [book.id, book]));
  }, [books]);

  const calendarData = useMemo(() => {
    const logMap = new Map(logs.map(log => [log.date, log]));
    const weeks: { date: string; pagesRead: number; duration: number; booksRead: string[] }[][] = [];

    console.log('📅 LogMap keys:', Array.from(logMap.keys()));

    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 83);

    // Adjust start to Monday
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    start.setDate(start.getDate() - diff);

    console.log('📅 Start date:', start.toISOString().split('T')[0]);

    let currentWeek: { date: string; pagesRead: number; duration: number; booksRead: string[] }[] = [];

    for (let i = 0; i < 84; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);  // FIX: Use date.getDate(), not start.getDate()
      const dateStr = date.toISOString().split('T')[0];
      const log = logMap.get(dateStr);

      if (log) {
        console.log('✅ Found log for', dateStr, ':', log);
      }

      currentWeek.push({
        date: dateStr,
        pagesRead: log?.pagesRead || 0,
        duration: log?.duration || 0,
        booksRead: log?.booksRead || [],
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
  }, [logs, bookMap]);

  const getBorderIntensity = (pagesRead: number): string => {
    if (pagesRead === 0) return 'border border-muted';
    if (pagesRead < 10) return 'border-2 border-green-300 dark:border-green-800';
    if (pagesRead < 25) return 'border-[3px] border-green-400 dark:border-green-600';
    if (pagesRead < 50) return 'border-[4px] border-green-500 dark:border-green-500';
    return 'border-[5px] border-green-600 dark:border-green-400';
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
            <div key={weekIndex} className="flex flex-col gap-1 flex-1 min-w-[32px]">
              {week.map((day, dayIndex) => {
                const dayBooks = day.booksRead
                  .map(bookId => bookMap.get(bookId))
                  .filter(Boolean)
                  .slice(0, 1); // Show only first book

                return (
                  <div
                    key={day.date}
                    className={`aspect-square rounded-md transition-all cursor-pointer hover:ring-2 hover:ring-primary overflow-hidden ${getBorderIntensity(day.pagesRead)} bg-muted relative group`}
                    title={`${formatDate(day.date)}\n${day.pagesRead} Seiten gelesen\n${formatDuration(day.duration)}${day.booksRead.length > 0 ? `\n${day.booksRead.length} Buch/Bücher` : ''}`}
                    style={{ minWidth: '24px', minHeight: '24px' }}
                  >
                    {dayBooks.length > 0 && dayBooks[0]?.coverUrl ? (
                      <>
                        <img
                          src={dayBooks[0].coverUrl}
                          alt={dayBooks[0].title}
                          className="w-full h-full object-cover"
                        />
                        {day.booksRead.length > 1 && (
                          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold px-1 rounded-tl">
                            +{day.booksRead.length - 1}
                          </div>
                        )}
                      </>
                    ) : dayBooks.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <BookOpen className="w-3 h-3 text-primary" />
                      </div>
                    ) : day.pagesRead > 0 ? (
                      <div className="w-full h-full flex items-center justify-center bg-green-500/20">
                        <BookOpen className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Weniger gelesen</span>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-md border border-muted bg-muted flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="w-6 h-6 rounded-md border-2 border-green-300 dark:border-green-800 bg-primary/5 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-primary" />
          </div>
          <div className="w-6 h-6 rounded-md border-[3px] border-green-400 dark:border-green-600 bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-primary" />
          </div>
          <div className="w-6 h-6 rounded-md border-[4px] border-green-500 dark:border-green-500 bg-primary/15 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-primary" />
          </div>
          <div className="w-6 h-6 rounded-md border-[5px] border-green-600 dark:border-green-400 bg-primary/20 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-primary" />
          </div>
        </div>
        <span>Mehr gelesen</span>
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
