import { Leaf, Sparkles } from "lucide-react";
import { useDailyLogs } from "@/hooks/useStreak";

export function WelcomeHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  // Get today's reading time
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyLogs } = useDailyLogs({
    startDate: today,
    endDate: today,
  });

  const todayLog = dailyLogs?.[0];
  const readingMinutes = todayLog?.duration || 0;

  return (
    <div className="relative mb-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-warm animate-shimmer" />
            <span className="text-sm font-medium text-muted-foreground">
              Willkommen zurück
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            {getGreeting()}, Leser! 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Ein guter Tag zum Lesen. Dein nächstes Abenteuer wartet in den Seiten
            deiner Bücher.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="hidden lg:flex items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-forest-light/10 border border-primary/20">
          <Leaf className="w-8 h-8 text-primary animate-sway" />
          <div>
            <p className="text-sm text-muted-foreground">Heute gelesen</p>
            <p className="text-2xl font-serif font-bold text-foreground">{readingMinutes} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
