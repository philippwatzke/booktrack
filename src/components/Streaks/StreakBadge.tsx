import { Card } from "@/components/ui/card";
import { useStreak } from "@/hooks/useStreak";
import { Flame, TrendingUp } from "lucide-react";

export function StreakBadge() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!streak) return null;

  const isActiveStreak = streak.currentStreak > 0;

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all relative overflow-hidden">
      {/* Animated flame background for active streaks */}
      {isActiveStreak && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Flame className="w-full h-full text-orange-500" />
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isActiveStreak
                ? 'bg-gradient-to-br from-orange-500 to-red-500 animate-pulse'
                : 'bg-muted'
            }`}>
              <Flame className={`h-6 w-6 ${isActiveStreak ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktueller Streak</p>
              <p className="text-3xl font-bold text-foreground">
                {streak.currentStreak} {streak.currentStreak === 1 ? 'Tag' : 'Tage'}
              </p>
            </div>
          </div>

          {streak.longestStreak > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Bester Streak
              </p>
              <p className="text-lg font-semibold text-primary">
                {streak.longestStreak} {streak.longestStreak === 1 ? 'Tag' : 'Tage'}
              </p>
            </div>
          )}
        </div>

        {/* Freeze days info */}
        {streak.freezeDaysAvailable > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-xl">
            <p className="text-sm font-medium text-primary">
              ❄️ {streak.freezeDaysAvailable} Freeze-{streak.freezeDaysAvailable === 1 ? 'Tag' : 'Tage'} verfügbar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Schütze deinen Streak an einem freien Tag
            </p>
          </div>
        )}

        {/* Motivation message */}
        {isActiveStreak && streak.currentStreak > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-foreground">
              {streak.currentStreak >= 30 && "Unglaublich! Du bist auf Feuer! 🔥"}
              {streak.currentStreak >= 14 && streak.currentStreak < 30 && "Fantastisch! Weiter so! 💪"}
              {streak.currentStreak >= 7 && streak.currentStreak < 14 && "Eine Woche geschafft! 🎉"}
              {streak.currentStreak >= 3 && streak.currentStreak < 7 && "Toller Start! 🌟"}
              {streak.currentStreak < 3 && "Los geht's! 🚀"}
            </p>
          </div>
        )}

        {!isActiveStreak && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Starte deinen Streak heute! 📚
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
