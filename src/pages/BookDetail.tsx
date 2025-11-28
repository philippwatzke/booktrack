import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockBooks } from "@/data/mockBooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = mockBooks.find((b) => b.id === id);
  const [sessionOpen, setSessionOpen] = useState(false);

  if (!book) {
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
              <Button variant="outline" className="w-full rounded-xl h-12 border-border">
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
              <Button variant="outline" className="w-full rounded-xl h-12 border-border text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </Button>
            </div>

            {/* Reading Session Timer */}
            <ReadingSessionTimer
              open={sessionOpen}
              onOpenChange={setSessionOpen}
              bookTitle={book.title}
              currentPage={book.currentPage}
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

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
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
              <Card className="p-4 rounded-xl border-border text-center">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">~5h</div>
                <div className="text-xs text-muted-foreground">Lesezeit</div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full rounded-xl bg-muted p-1">
                <TabsTrigger value="overview" className="flex-1 rounded-lg">
                  Übersicht
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-1 rounded-lg">
                  Notizen
                </TabsTrigger>
                <TabsTrigger value="quotes" className="flex-1 rounded-lg">
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

              <TabsContent value="notes" className="mt-6">
                <NoteEditor bookId={book.id} />
              </TabsContent>

              <TabsContent value="quotes" className="mt-6">
                <QuoteEditor bookId={book.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
