import { useQuery } from "@tanstack/react-query";
import { readingSessionsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, Hourglass } from "lucide-react";

interface ReadingStatsProps {
  bookId: string;
}

interface ReadingStatsData {
  pagesPerHour: number;
  averageSessionDuration: number;
  totalReadingTime: number;
  totalPagesRead: number;
  estimatedTimeToFinish: number | null;
}

export function ReadingStats({ bookId }: ReadingStatsProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['readingStats', bookId],
    queryFn: async () => {
      const response = await readingSessionsApi.getStats(bookId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch reading stats');
      }
      return response.data as ReadingStatsData;
    },
  });

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 rounded-xl border-border animate-pulse">
            <div className="h-12 bg-muted rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats || stats.pagesPerHour === 0) {
    return (
      <Card className="p-6 rounded-xl border-border border-dashed text-center">
        <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">
          Noch keine Lese-Sessions vorhanden.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Starte eine Lese-Session, um deine Statistiken zu sehen!
        </p>
      </Card>
    );
  }

  const formatTime = (minutes: number | null) => {
    if (!minutes) return 'Unbekannt';
    if (minutes < 60) return `${minutes} Min.`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Reading Speed */}
      <Card className="p-4 rounded-xl border-border shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground mb-1">
          {stats.pagesPerHour}
        </p>
        <p className="text-xs text-muted-foreground">Seiten pro Stunde</p>
      </Card>

      {/* Average Session Duration */}
      <Card className="p-4 rounded-xl border-border shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Clock className="h-5 w-5 text-accent" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground mb-1">
          {formatTime(Math.round(stats.averageSessionDuration / 60))}
        </p>
        <p className="text-xs text-muted-foreground">Ø Session-Dauer</p>
      </Card>

      {/* Estimated Time to Finish */}
      {stats.estimatedTimeToFinish !== null && (
        <Card className="p-4 rounded-xl border-border shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Hourglass className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">
            {formatTime(stats.estimatedTimeToFinish)}
          </p>
          <p className="text-xs text-muted-foreground">Geschätzt bis fertig</p>
        </Card>
      )}
    </div>
  );
}
