import { BookCard } from "@/components/Books/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookOpen, TrendingUp } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Reading() {
  const navigate = useNavigate();
  const { data: books = [], isLoading } = useBooks({ status: "READING" });
  const readingBooks = books;

  const totalPages = readingBooks.reduce((sum, book) => sum + (book.currentPage || 0), 0);
  const totalBooksPages = readingBooks.reduce((sum, book) => sum + (book.pageCount || 0), 0);
  const overallProgress = totalBooksPages > 0
    ? Math.round((totalPages / totalBooksPages) * 100)
    : 0;

  // Set page title with overall progress
  usePageTitle({
    title: `Lese ich (${readingBooks.length})`,
    progress: overallProgress,
    showProgress: readingBooks.length > 0 && overallProgress > 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Bücher werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Aktuell lesen</h1>
          <p className="text-muted-foreground">
            {readingBooks.length} {readingBooks.length === 1 ? "Buch" : "Bücher"} in Bearbeitung
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 rounded-2xl border-border shadow-md bg-gradient-to-br from-primary-light/40 to-primary-light/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gesamtfortschritt</p>
                <p className="text-3xl font-bold text-foreground">{overallProgress}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md bg-gradient-to-br from-accent-light/40 to-accent-light/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gelesene Seiten</p>
                <p className="text-3xl font-bold text-foreground">{totalPages}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Books Grid */}
        {readingBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {readingBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 rounded-2xl border-border text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keine Bücher in Bearbeitung
            </h3>
            <p className="text-muted-foreground">
              Starte ein neues Buch aus deiner Bibliothek oder Wunschliste
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
