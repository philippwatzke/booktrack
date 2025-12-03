import { Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useGoals, usePreferences } from "@/hooks/useGoals";
import { useBooks } from "@/hooks/useBooks";

export function ReadingGoal() {
  const { data: preferences } = usePreferences();
  const { data: goals } = useGoals();
  const { data: finishedBooks } = useBooks({ status: "FINISHED" });

  const yearlyGoal = preferences?.yearlyGoal || 30;
  const booksRead = finishedBooks?.length || 0;
  const progress = Math.round((booksRead / yearlyGoal) * 100);

  // Calculate books ahead/behind schedule
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const daysInYear = 365;
  const daysPassed = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const expectedBooks = Math.floor((daysPassed / daysInYear) * yearlyGoal);
  const booksAhead = booksRead - expectedBooks;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold">Jahresziel {new Date().getFullYear()}</h2>
            <p className="text-sm text-muted-foreground">Du schaffst das!</p>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 4.02} 402`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-serif font-bold">{booksRead}</span>
              <span className="text-sm text-muted-foreground">von {yearlyGoal}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {booksAhead > 0 ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              {booksAhead} Bücher vor dem Plan!
            </span>
          </div>
        ) : booksAhead < 0 ? (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted text-muted-foreground">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              {Math.abs(booksAhead)} Bücher hinter dem Plan
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              Genau im Plan!
            </span>
          </div>
        )}

        {/* Monthly Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
}
