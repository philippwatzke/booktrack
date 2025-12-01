import { useGoals, usePreferences } from "@/hooks/useGoals";
import { useDailyLogs } from "@/hooks/useStreak";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Clock } from "lucide-react";

export function GoalsWidget() {
  const { data: goals = [], isLoading } = useGoals();
  const { data: preferences } = usePreferences();

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Get daily logs to find today's reading time
  const { data: logs = [] } = useDailyLogs({
    startDate: today,
    endDate: today,
  });

  const todayLog = logs.find((log: any) => log.date === today);
  const minutesRead = todayLog ? Math.floor(todayLog.duration / 60) : 0;
  const dailyGoal = preferences?.dailyReadingGoalMins || 0;

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const activeGoals = goals.filter((g: any) => !g.completed);
  const annualGoal = goals.find((g: any) => g.type === 'ANNUAL' && !g.completed);

  if (activeGoals.length === 0) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md border-dashed">
        <div className="text-center py-4">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keine aktiven Ziele
          </h3>
          <p className="text-sm text-muted-foreground">
            Setze dir ein Leseziel, um motiviert zu bleiben!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Meine Ziele
        </h3>
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {dailyGoal > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Tägliches Leseziel
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {minutesRead} / {dailyGoal} Min
              </span>
            </div>
            <Progress
              value={Math.min((minutesRead / dailyGoal) * 100, 100)}
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {minutesRead >= dailyGoal
                ? '🎉 Tagesziel erreicht!'
                : `Noch ${dailyGoal - minutesRead} Min bis zum Tagesziel`
              }
            </p>
          </div>
        )}

        {annualGoal && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {annualGoal.target} Bücher in 2025
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {annualGoal.current} / {annualGoal.target}
              </span>
            </div>
            <Progress
              value={(annualGoal.current / annualGoal.target) * 100}
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((annualGoal.current / annualGoal.target) * 100)}% erreicht
            </p>
          </div>
        )}

        {activeGoals
          .filter((g: any) => g.type !== 'ANNUAL')
          .slice(0, 2)
          .map((goal: any) => {
            const progressPercent = Math.round((goal.current / goal.target) * 100);
            const metricLabel =
              goal.metric === 'BOOKS' ? 'Bücher' :
              goal.metric === 'PAGES' ? 'Seiten' :
              'Minuten';

            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {goal.target} {metricLabel}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progressPercent}% erreicht
                </p>
              </div>
            );
          })}
      </div>

      {activeGoals.length > 3 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          +{activeGoals.length - 3} weitere Ziele
        </p>
      )}
    </Card>
  );
}
