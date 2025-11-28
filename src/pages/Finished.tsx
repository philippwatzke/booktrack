import { BookCard } from "@/components/Books/BookCard";
import { mockBooks } from "@/data/mockBooks";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BookCheck, Star, Trophy } from "lucide-react";

export default function Finished() {
  const navigate = useNavigate();
  const finishedBooks = mockBooks.filter((book) => book.status === "FINISHED");

  const averageRating = finishedBooks.length > 0
    ? (finishedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / finishedBooks.length).toFixed(1)
    : 0;

  const fiveStarBooks = finishedBooks.filter((book) => book.rating === 5).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gelesen</h1>
          <p className="text-muted-foreground">
            {finishedBooks.length} {finishedBooks.length === 1 ? "Buch" : "Bücher"} abgeschlossen
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 rounded-2xl border-border shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bücher gelesen</p>
                <p className="text-3xl font-bold text-foreground">{finishedBooks.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ø Bewertung</p>
                <p className="text-3xl font-bold text-foreground">{averageRating}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent fill-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">5-Sterne Bücher</p>
                <p className="text-3xl font-bold text-foreground">{fiveStarBooks}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Books Grid */}
        {finishedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {finishedBooks.map((book) => (
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
              <BookCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Noch keine Bücher abgeschlossen
            </h3>
            <p className="text-muted-foreground">
              Deine gelesenen Bücher werden hier angezeigt
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
