import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStreak } from "@/hooks/useStreak";
import { Trophy, Target, Sparkles, Crown, Zap } from "lucide-react";

interface Milestone {
  days: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    days: 7,
    title: "Eine Woche",
    description: "7 Tage am Stück gelesen",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    days: 14,
    title: "Zwei Wochen",
    description: "14 Tage Lesegewohnheit",
    icon: <Target className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    days: 30,
    title: "Ein Monat",
    description: "30 Tage Leseroutine",
    icon: <Trophy className="h-5 w-5" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    days: 100,
    title: "Hundert Tage",
    description: "100 Tage Lesedisziplin",
    icon: <Zap className="h-5 w-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    days: 365,
    title: "Ein Jahr",
    description: "365 Tage Leseleidenschaft",
    icon: <Crown className="h-5 w-5" />,
    color: "from-yellow-400 to-amber-600",
  },
];

export function StreakMilestones() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md">
        <h3 className="text-xl font-bold text-foreground mb-4">Meilensteine</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-xl"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!streak) return null;

  const longestStreak = streak.longestStreak;
  const currentStreak = streak.currentStreak;

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Meilensteine</h3>
        <Badge variant="outline" className="rounded-full">
          {MILESTONES.filter(m => longestStreak >= m.days).length} / {MILESTONES.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {MILESTONES.map((milestone) => {
          const isAchieved = longestStreak >= milestone.days;
          const isNext = !isAchieved && (longestStreak < milestone.days);
          const progress = Math.min((currentStreak / milestone.days) * 100, 100);

          return (
            <div
              key={milestone.days}
              className={`relative p-4 rounded-xl border transition-all ${
                isAchieved
                  ? 'border-primary bg-gradient-to-r ' + milestone.color + ' bg-opacity-10'
                  : isNext
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isAchieved
                      ? `bg-gradient-to-br ${milestone.color} text-white shadow-lg`
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {milestone.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold ${isAchieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </p>
                    {isAchieved && (
                      <Badge variant="default" className="rounded-full text-xs px-2 py-0">
                        Erreicht!
                      </Badge>
                    )}
                    {isNext && (
                      <Badge variant="outline" className="rounded-full text-xs px-2 py-0">
                        Nächster
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>

                  {/* Progress bar for active/next milestone */}
                  {(isNext || (!isAchieved && currentStreak > 0)) && (
                    <div className="mt-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentStreak} / {milestone.days} Tage
                      </p>
                    </div>
                  )}

                  {/* Achievement date */}
                  {isAchieved && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ✓ Mit {longestStreak}-Tage-Streak erreicht
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation */}
      {currentStreak > 0 && currentStreak < 7 && (
        <div className="mt-6 p-4 bg-primary/10 rounded-xl text-center">
          <p className="text-sm font-medium text-foreground">
            Noch {7 - currentStreak} {7 - currentStreak === 1 ? 'Tag' : 'Tage'} bis zum ersten Meilenstein! 🎯
          </p>
        </div>
      )}

      {currentStreak >= 7 && currentStreak < 14 && (
        <div className="mt-6 p-4 bg-primary/10 rounded-xl text-center">
          <p className="text-sm font-medium text-foreground">
            Großartig! Noch {14 - currentStreak} {14 - currentStreak === 1 ? 'Tag' : 'Tage'} bis zum nächsten Meilenstein! 💪
          </p>
        </div>
      )}
    </Card>
  );
}
