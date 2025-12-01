import { BookCard } from "@/components/Books/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, Flame } from "lucide-react";

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: books = [], isLoading } = useBooks({ status: "WANT_TO_READ" });
  const wishlistBooks = books;

  const sortedBooks = [...wishlistBooks].sort((a, b) =>
    (b.priority || 0) - (a.priority || 0)
  );

  const highPriorityBooks = wishlistBooks.filter((book) => (book.priority || 0) >= 4).length;

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Wunschliste</h1>
          <p className="text-muted-foreground">
            {wishlistBooks.length} {wishlistBooks.length === 1 ? "Buch" : "Bücher"} auf deiner Liste
          </p>
        </div>

        {/* Priority Info */}
        {highPriorityBooks > 0 && (
          <Card className="p-6 rounded-2xl border-border shadow-md mb-8 bg-gradient-to-br from-primary-light/40 to-accent-light/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {highPriorityBooks} {highPriorityBooks === 1 ? "Buch hat" : "Bücher haben"} hohe Priorität
                </h3>
                <p className="text-sm text-muted-foreground">
                  Diese Bücher warten darauf, gelesen zu werden
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedBooks.map((book) => (
              <div key={book.id} className="relative">
                {book.priority && book.priority >= 4 && (
                  <Badge 
                    className="absolute -top-2 -right-2 z-10 rounded-full bg-primary text-primary-foreground shadow-lg"
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    Priorität {book.priority}
                  </Badge>
                )}
                <BookCard
                  book={book}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 rounded-2xl border-border text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <BookmarkPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Deine Wunschliste ist leer
            </h3>
            <p className="text-muted-foreground">
              Füge Bücher hinzu, die du gerne lesen möchtest
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
