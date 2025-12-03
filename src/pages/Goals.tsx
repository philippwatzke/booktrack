import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Plus,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useStreak } from "@/hooks/useStreak";

const typeColors: Record<string, string> = {
  yearly: "bg-primary text-primary-foreground",
  monthly: "bg-amber-warm text-accent-foreground",
  weekly: "bg-forest-light text-primary-foreground",
  daily: "bg-nature-water text-primary-foreground",
};

const typeLabels: Record<string, string> = {
  yearly: "Jährlich",
  monthly: "Monatlich",
  weekly: "Wöchentlich",
  daily: "Täglich",
};

const achievements = [
  { id: 1, title: "Erste Schritte", description: "Erstes Buch hinzugefügt", icon: BookOpen, unlocked: true },
  { id: 2, title: "Woche des Lesens", description: "7 Tage Streak erreicht", icon: Flame, unlocked: true },
  { id: 3, title: "Bücherwurm", description: "10 Bücher gelesen", icon: Trophy, unlocked: true },
  { id: 4, title: "Marathon-Leser", description: "30 Tage Streak", icon: TrendingUp, unlocked: false },
  { id: 5, title: "Bibliophile", description: "50 Bücher gelesen", icon: Target, unlocked: false },
];

export default function Goals() {
  const { data: goals = [], isLoading } = useGoals();
  const { data: streakData } = useStreak();

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ziele werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
              <Target className="w-10 h-10 text-primary" />
              Ziele
            </h1>
            <p className="text-muted-foreground">
              Setze dir Ziele und verfolge deinen Fortschritt
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Neues Ziel
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Goals List */}
          <div className="lg:col-span-2 space-y-6">
            {goals.length === 0 ? (
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Noch keine Ziele gesetzt
                  </h3>
                  <p className="text-muted-foreground">
                    Erstelle dein erstes Leseziel
                  </p>
                </CardContent>
              </Card>
            ) : (
              goals.map((goal: any, index: number) => (
                <Card
                  key={goal.id}
                  className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif font-bold text-xl text-foreground">
                            {goal.title || "Ziel"}
                          </h3>
                          <Badge className={typeColors[goal.type] || typeColors.yearly}>
                            {typeLabels[goal.type] || "Ziel"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{goal.description}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-serif font-bold text-foreground">
                          {goal.current && goal.target ? Math.round((goal.current / goal.target) * 100) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3" />
                          {goal.deadline || "Kein Ziel"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Progress
                        value={goal.current && goal.target ? (goal.current / goal.target) * 100 : 0}
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {goal.current || 0} / {goal.target || 0} {goal.unit || "Einheiten"}
                        </span>
                        <span className="text-foreground font-medium">
                          {(goal.target || 0) - (goal.current || 0)} {goal.unit || "Einheiten"} übrig
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar - Achievements */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <Card className="bg-gradient-to-br from-primary/20 to-forest-light/20 border-primary/30 animate-fade-in delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-warm" />
                  Dein Fortschritt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Flame className="w-4 h-4 text-destructive" />
                    Aktueller Streak
                  </span>
                  <span className="font-bold text-foreground">
                    {streakData?.currentStreak || 0} Tage
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Bücher dieses Jahr
                  </span>
                  <span className="font-bold text-foreground">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-warm" />
                    Lesezeit gesamt
                  </span>
                  <span className="font-bold text-foreground">0h</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-warm" />
                  Erfolge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        achievement.unlocked
                          ? "bg-primary/10"
                          : "bg-muted/30 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.unlocked
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
