import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBook, useDeleteBook } from "@/hooks/useBooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  BookOpen,
  Play,
  Edit,
  Trash2
} from "lucide-react";
import { ReadingSessionTimer } from "@/components/ReadingSession/ReadingSessionTimer";
import { NoteEditor } from "@/components/Notes/NoteEditor";
import { QuoteEditor } from "@/components/Quotes/QuoteEditor";
import { EditBookDialog } from "@/components/Books/EditBookDialog";
import { ReadingStats } from "@/components/Books/ReadingStats";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: book, isLoading, error } = useBook(id || "");
  const deleteBook = useDeleteBook();
  const [sessionOpen, setSessionOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Buch wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Buch nicht gefunden</h2>
          <Button onClick={() => navigate("/")}>Zurück zur Bibliothek</Button>
        </div>
      </div>
    );
  }

  const progressPercent = book.currentPage && book.pageCount
    ? Math.round((book.currentPage / book.pageCount) * 100)
    : 0;

  const handleDelete = async () => {
    await deleteBook.mutateAsync(book.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Left Column - Cover & Actions */}
          <div>
            {/* Cover */}
            <Card className="overflow-hidden rounded-2xl border-border shadow-lg mb-6">
              <div className="aspect-[2/3] bg-muted">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-light to-accent-light">
                    <span className="text-6xl font-bold text-primary/30">
                      {book.title[0]}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              {book.status === "READING" && (
                <Button 
                  onClick={() => setSessionOpen(true)}
                  className="w-full rounded-xl h-12 bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Session starten
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setEditOpen(true)}
                className="w-full rounded-xl h-12 border-border"
              >
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="w-full rounded-xl h-12 border-border text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
            </div>

            {/* Reading Session Timer */}
            <ReadingSessionTimer
              open={sessionOpen}
              onOpenChange={setSessionOpen}
              bookId={book.id}
              bookTitle={book.title}
              currentPage={book.currentPage}
              totalPages={book.pageCount}
            />
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
                </div>
                {book.rating && (
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold text-primary">{book.rating}/5</span>
                  </div>
                )}
              </div>

              {/* Genres & Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.genres?.map((genre) => (
                  <Badge key={genre} variant="default" className="rounded-full">
                    {genre}
                  </Badge>
                ))}
                {book.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            {book.status === "READING" && (
              <Card className="p-6 rounded-2xl border-border shadow-md mb-6 bg-gradient-to-br from-primary-light/30 to-accent-light/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Lesefortschritt
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {book.currentPage} von {book.pageCount} Seiten
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {progressPercent}%
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </Card>
            )}

            {/* Reading Stats */}
            {book.status === "READING" && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Lese-Statistiken
                </h3>
                <ReadingStats bookId={book.id} />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 rounded-xl border-border text-center">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{book.pageCount}</div>
                <div className="text-xs text-muted-foreground">Seiten</div>
              </Card>
              <Card className="p-4 rounded-xl border-border text-center">
                <Calendar className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {book.publishedYear || "—"}
                </div>
                <div className="text-xs text-muted-foreground">Jahr</div>
              </Card>
              {book.status === "READING" && (
                <Card className="p-4 rounded-xl border-border text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {Math.floor((new Date().getTime() - new Date(book.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.floor((new Date().getTime() - new Date(book.createdAt).getTime()) / (1000 * 60 * 60 * 24)) === 1 ? 'Tag' : 'Tage'} seit Start
                  </div>
                </Card>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1">
                <TabsTrigger value="overview" className="rounded-lg">
                  Übersicht
                </TabsTrigger>
                <TabsTrigger value="sessions" className="rounded-lg">
                  Sessions
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg">
                  Notizen
                </TabsTrigger>
                <TabsTrigger value="quotes" className="rounded-lg">
                  Zitate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="p-6 rounded-2xl border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Beschreibung
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description || "Keine Beschreibung verfügbar."}
                  </p>
                  {book.publisher && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Verlag:</span> {book.publisher}
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="sessions" className="mt-6">
                <div className="space-y-4">
                  {book.readingSessions && book.readingSessions.length > 0 ? (
                    book.readingSessions.map((session: any) => (
                      <Card key={session.id} className="p-5 rounded-2xl border-border">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-semibold text-foreground">
                                {new Date(session.createdAt).toLocaleDateString('de-DE', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.floor(session.duration / 60)} Minuten • Seite {session.startPage} - {session.endPage}
                              </div>
                            </div>
                          </div>
                          {session.quality && (
                            <Badge variant="secondary" className="rounded-full">
                              Fokus: {session.quality}/5
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-foreground">{session.pagesRead}</div>
                            <div className="text-xs text-muted-foreground">Seiten</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-foreground">
                              {Math.round((session.pagesRead / (session.duration / 3600)))}
                            </div>
                            <div className="text-xs text-muted-foreground">S/h</div>
                          </div>
                          {session.location && (
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <div className="text-sm font-medium text-foreground">
                                {session.location === 'HOME' ? '🏠' :
                                 session.location === 'COMMUTE' ? '🚆' :
                                 session.location === 'CAFE' ? '☕' :
                                 session.location === 'TRAVEL' ? '✈️' : '📍'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {session.location === 'HOME' ? 'Zuhause' :
                                 session.location === 'COMMUTE' ? 'Unterwegs' :
                                 session.location === 'CAFE' ? 'Café' :
                                 session.location === 'TRAVEL' ? 'Reise' : 'Sonstiges'}
                              </div>
                            </div>
                          )}
                          {session.timeOfDay && (
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                              <div className="text-sm font-medium text-foreground">
                                {session.timeOfDay === 'MORNING' ? '🌅' :
                                 session.timeOfDay === 'AFTERNOON' ? '☀️' :
                                 session.timeOfDay === 'EVENING' ? '🌆' : '🌙'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {session.timeOfDay === 'MORNING' ? 'Morgen' :
                                 session.timeOfDay === 'AFTERNOON' ? 'Mittag' :
                                 session.timeOfDay === 'EVENING' ? 'Abend' : 'Nacht'}
                              </div>
                            </div>
                          )}
                        </div>

                        {session.notes && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="text-sm font-medium text-foreground mb-2">Session-Notizen</div>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {session.notes}
                            </p>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 rounded-2xl border-border text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">
                        Noch keine Lese-Sessions vorhanden
                      </p>
                      <Button
                        onClick={() => setSessionOpen(true)}
                        variant="outline"
                        className="mt-4 rounded-xl"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Erste Session starten
                      </Button>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <NoteEditor bookId={book.id} totalPages={book.pageCount} />
              </TabsContent>

              <TabsContent value="quotes" className="mt-6">
                <QuoteEditor bookId={book.id} totalPages={book.pageCount} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditBookDialog
        book={book}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Buch löschen?</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du "{book.title}" löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
              Alle Notizen, Zitate und Lesesessions werden ebenfalls gelöscht.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl"
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBook.isPending}
              className="rounded-xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
