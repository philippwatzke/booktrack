import { Card } from "@/components/ui/card";
import { Target, TrendingUp, Book } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useBooks } from "@/hooks/useBooks";

export function YearGoalProgressWidget() {
  const { data: goals = [] } = useGoals();
  const { data: books = [] } = useBooks();

  // Find the active yearly book goal
  const currentYear = new Date().getFullYear();

  const yearlyGoal = goals.find(
    (goal) => {
      // Check if it's an annual book goal for the current year
      if (goal.type === "ANNUAL" && goal.metric === "BOOKS" && !goal.completed) {
        const deadline = new Date(goal.deadline);
        return deadline.getFullYear() === currentYear;
      }
      return false;
    }
  );

  // If no goal exists, show empty state
  if (!yearlyGoal) {
    // Still count books finished this year
    const booksFinishedThisYear = books.filter((book) => {
      if (book.status !== "FINISHED" || !book.finishedAt) return false;
      const finishedYear = new Date(book.finishedAt).getFullYear();
      return finishedYear === currentYear;
    }).length;

    return (
      <Card className="p-6 rounded-2xl border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Jahresziel {currentYear}</h3>
              <p className="text-xs text-muted-foreground">
                Dein Lesefortschritt
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h4 className="text-lg font-semibold mb-2">Kein Jahresziel gesetzt</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Du hast dieses Jahr bereits {booksFinishedThisYear} {booksFinishedThisYear === 1 ? 'Buch' : 'Bücher'} gelesen!
          </p>
          <p className="text-xs text-muted-foreground">
            Setze dir ein Jahresziel in den Einstellungen, um deinen Fortschritt zu verfolgen.
          </p>
        </div>
      </Card>
    );
  }

  // Count books finished this year
  const booksFinishedThisYear = books.filter((book) => {
    if (book.status !== "FINISHED" || !book.finishedAt) return false;
    const finishedYear = new Date(book.finishedAt).getFullYear();
    return finishedYear === currentYear;
  }).length;

  const progress = Math.min(
    (booksFinishedThisYear / yearlyGoal.target) * 100,
    100
  );
  const remaining = Math.max(yearlyGoal.target - booksFinishedThisYear, 0);
  const isAheadOfPace = booksFinishedThisYear > yearlyGoal.current;

  return (
    <Card className="p-6 rounded-2xl border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Jahresziel {currentYear}</h3>
            <p className="text-xs text-muted-foreground">
              Dein Lesefortschritt
            </p>
          </div>
        </div>
        {isAheadOfPace && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            Im Plan
          </div>
        )}
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-foreground">
              {Math.round(progress)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {booksFinishedThisYear} / {yearlyGoal.target}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Book className="h-4 w-4 text-primary" />
            <p className="text-2xl font-bold text-foreground">
              {booksFinishedThisYear}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Gelesen</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{remaining}</p>
          </div>
          <p className="text-xs text-muted-foreground">Verbleibend</p>
        </div>
      </div>

      {/* Motivational Message */}
      {remaining > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-center text-foreground">
            {remaining === 1
              ? "Nur noch ein Buch bis zum Ziel! 🎯"
              : remaining <= 5
              ? `Nur noch ${remaining} Bücher! Du schaffst das! 💪`
              : `Noch ${remaining} Bücher auf dem Weg zu deinem Ziel 📚`}
          </p>
        </div>
      )}

      {/* Achievement Message */}
      {remaining === 0 && (
        <div className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-sm text-center font-medium text-accent">
            🎉 Ziel erreicht! Fantastisch!
          </p>
        </div>
      )}
    </Card>
  );
}
