import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { useReadingSessions } from "@/hooks/useReadingSessions";

export default function Reading() {
  const { data: books = [], isLoading } = useBooks({ status: "READING" });
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);

  // Get reading sessions for all current books
  const bookIds = books.map(book => book.id);

  // Calculate weekly stats from all books
  const weeklyPagesRead = 142; // This would come from reading sessions API
  const weeklyReadingTime = "4h 32m";
  const weeklySessions = 8;

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Bücher werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const recentSessions = [
    { date: "Heute", book: books[0]?.title || "Buch", pages: 12, duration: "25 Min" },
    { date: "Gestern", book: books[1]?.title || "Buch", pages: 18, duration: "32 Min" },
  ];

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Aktuell Lesen
          </h1>
          <p className="text-muted-foreground">
            Verfolge deinen Lesefortschritt und starte Lesesessions
          </p>
        </div>

        {books.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Keine Bücher werden aktuell gelesen
              </h3>
              <p className="text-muted-foreground">
                Starte ein neues Buch aus deiner Bibliothek oder Wunschliste
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Books */}
            <div className="lg:col-span-2 space-y-6">
              {books.map((book, index) => {
                const progress = book.currentPage && book.pageCount
                  ? (book.currentPage / book.pageCount) * 100
                  : 0;
                const pagesLeft = book.pageCount - (book.currentPage || 0);
                const dailyGoal = 30;
                const todayPages = 0;

                return (
                  <Card
                    key={book.id}
                    className="bg-card/80 backdrop-blur-sm border-border animate-fade-in overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={book.coverUrl || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop"}
                          alt={book.title}
                          className="w-28 h-40 object-cover rounded-xl shadow-lg"
                        />

                        <div className="flex-1 space-y-4">
                          <div>
                            <h2 className="text-2xl font-serif font-bold text-foreground">
                              {book.title}
                            </h2>
                            <p className="text-muted-foreground">{book.author}</p>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Fortschritt</span>
                              <span className="font-medium text-foreground">
                                {book.currentPage || 0} / {book.pageCount} Seiten
                              </span>
                            </div>
                            <Progress
                              value={progress}
                              className="h-3"
                            />
                            <p className="text-xs text-muted-foreground">
                              Noch {pagesLeft} Seiten übrig
                            </p>
                          </div>

                          {/* Daily Goal */}
                          <div className="flex items-center gap-4">
                            <div className="flex-1 p-3 rounded-lg bg-secondary/50">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Target className="w-4 h-4" />
                                Tagesziel
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={(todayPages / dailyGoal) * 100}
                                  className="h-2 flex-1"
                                />
                                <span className="text-sm font-medium">
                                  {todayPages}/{dailyGoal}
                                </span>
                              </div>
                            </div>

                            <Button
                              size="lg"
                              className="gap-2"
                              onClick={() =>
                                setActiveSession(activeSession === book.id ? null : book.id)
                              }
                            >
                              {activeSession === book.id ? (
                                <>
                                  <Pause className="w-4 h-4" />
                                  Pausieren
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Lesen starten
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Session Timer */}
              {activeSession && (
                <Card className="bg-gradient-to-br from-primary/20 to-forest-light/20 border-primary/30 animate-scale-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-primary" />
                      Aktive Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-5xl font-serif font-bold text-foreground mb-2">
                        00:00
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {books.find((b) => b.id === activeSession)?.title}
                      </p>
                      <Button variant="outline" className="w-full">
                        Session beenden
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Diese Woche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Seiten gelesen</span>
                    <span className="font-semibold text-foreground">{weeklyPagesRead}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lesezeit</span>
                    <span className="font-semibold text-foreground">{weeklyReadingTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-semibold text-foreground">{weeklySessions}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    Letzte Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {session.book}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {session.pages} Seiten
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
