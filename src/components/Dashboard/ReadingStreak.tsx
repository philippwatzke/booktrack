import { Flame, Trophy, Calendar } from "lucide-react";
import { useStreak, useDailyLogs } from "@/hooks/useStreak";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function ReadingStreak() {
  const { data: streak } = useStreak();

  // Get logs for the last 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data: dailyLogs } = useDailyLogs({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;

  // Create array of last 7 days with reading status
  const streakData = weekDays.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateStr = date.toISOString().split('T')[0];
    return dailyLogs?.some(log => log.date === dateStr) || false;
  });

  // Calculate days read this month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);

  const { data: monthlyLogs } = useDailyLogs({
    startDate: firstDayOfMonth.toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const daysReadThisMonth = monthlyLogs?.length || 0;

  return (
    <div className="bg-gradient-to-br from-primary to-forest-deep text-primary-foreground rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Flame className="w-6 h-6 animate-float" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-semibold">Lese-Streak</h2>
            <p className="text-sm text-primary-foreground/70">Jeden Tag lesen!</p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="text-center mb-6">
          <p className="text-6xl font-serif font-bold mb-1">{currentStreak}</p>
          <p className="text-primary-foreground/80">Tage in Folge</p>
        </div>

        {/* Week Progress */}
        <div className="flex justify-between mb-6 px-2">
          {weekDays.map((day, index) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  streakData[index]
                    ? "bg-amber-glow text-foreground"
                    : "bg-primary-foreground/10"
                }`}
              >
                {streakData[index] && <Flame className="w-4 h-4" />}
              </div>
              <span className="text-xs text-primary-foreground/60">{day}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-amber-glow" />
              <span className="text-xs text-primary-foreground/70">Längster Streak</span>
            </div>
            <p className="text-xl font-serif font-bold">{longestStreak} Tage</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-amber-glow" />
              <span className="text-xs text-primary-foreground/70">Diesen Monat</span>
            </div>
            <p className="text-xl font-serif font-bold">{daysReadThisMonth} Tage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
