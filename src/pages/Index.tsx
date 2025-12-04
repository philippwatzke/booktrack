// Dashboard with Streak System
import { useState, useEffect } from "react";
import { StreakBadge } from "@/components/Streaks/StreakBadge";
import { StreakMilestones } from "@/components/Streaks/StreakMilestones";
import { StreakCalendar } from "@/components/Streaks/StreakCalendar";
import { MonthlyReportWidget } from "@/components/Dashboard/MonthlyReportWidget";
import { YearGoalProgressWidget } from "@/components/Dashboard/YearGoalProgressWidget";
import { GoalsWidget } from "@/components/Goals/GoalsWidget";
import { OnboardingDialog } from "@/components/Onboarding/OnboardingDialog";
import { useBooks } from "@/hooks/useBooks";
import { usePreferences } from "@/hooks/useGoals";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSimplePageTitle } from "@/hooks/usePageTitle";

const Index = () => {
  useSimplePageTitle("Dashboard");
  const { data: books = [] } = useBooks();
  const { data: preferences } = usePreferences();
  const { data: dashboardStats, isLoading: isDashboardLoading } = useDashboardStats();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user hasn't completed it
    if (preferences && !preferences.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [preferences]);

  const readingBooks = books.filter((b) => b.status === "READING");
  const finishedBooks = books.filter((b) => b.status === "FINISHED");
  const wishlistBooks = books.filter((b) => b.status === "WANT_TO_READ");

  // Get most recently updated reading book for "Continue Reading" button
  const lastReadingBook = readingBooks.length > 0
    ? readingBooks.sort((a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
      )[0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Deine Lese-Übersicht auf einen Blick</p>
            </div>
            {lastReadingBook && (
              <Button
                onClick={() => navigate(`/book/${lastReadingBook.id}`)}
                size="lg"
                className="rounded-xl gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Weiterlesen
              </Button>
            )}
          </div>
        </div>

        {/* Streak Badge */}
        <div className="mb-6">
          <StreakBadge />
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <Card
            className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/reading')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Aktuell lesen</p>
            <p className="text-4xl font-bold text-foreground">{readingBooks.length}</p>
          </Card>

          <Card
            className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/finished')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Gelesen</p>
            <p className="text-4xl font-bold text-foreground">{finishedBooks.length}</p>
          </Card>

          <Card
            className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate('/wishlist')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Wunschliste</p>
            <p className="text-4xl font-bold text-foreground">{wishlistBooks.length}</p>
          </Card>
        </div>

        {/* Goals Widget */}
        <div className="mb-6">
          <GoalsWidget />
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lese-Aktivität (Kalender) */}
          <StreakCalendar />

          {/* Streak Milestones */}
          <StreakMilestones />

          {/* Monthly Report */}
          {!isDashboardLoading && dashboardStats && (
            <MonthlyReportWidget
              data={dashboardStats.monthlyReport}
              defaultCollapsed={false}
            />
          )}

          {/* Year Goal Progress */}
          <YearGoalProgressWidget />
        </div>

        {/* Onboarding Dialog */}
        <OnboardingDialog
          open={showOnboarding}
          onComplete={() => setShowOnboarding(false)}
        />

        {/* Current Reading Books */}
        {readingBooks.length > 0 && (
          <Card className="p-6 rounded-2xl border-border shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Deine aktuellen Bücher</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/reading')}
                className="rounded-xl"
              >
                Alle anzeigen
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {readingBooks.slice(0, 3).map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-xl border border-border hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <div className="flex gap-3">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-muted rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{book.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                      {book.currentPage !== undefined && book.pageCount && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">
                              {book.currentPage} / {book.pageCount} Seiten
                            </p>
                            <p className="text-xs font-semibold text-primary">
                              {Math.round((book.currentPage / book.pageCount) * 100)}%
                            </p>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(book.currentPage / book.pageCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {books.length === 0 && (
          <Card className="p-12 rounded-2xl border-border border-dashed text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Noch keine Bücher in deiner Bibliothek.
            </p>
            <Button onClick={() => navigate('/library')} className="rounded-xl">
              <Plus className="mr-2 h-5 w-5" />
              Erstes Buch hinzufügen
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
