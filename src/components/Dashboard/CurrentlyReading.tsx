import { BookOpen, Clock, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/useBooks";
import { Book } from "@/types/book";

export function CurrentlyReading() {
  const { data: books, isLoading } = useBooks({ status: "READING" });

  const currentBooks = books?.slice(0, 2) || [];

  const getLastRead = (book: Book) => {
    const updatedDate = new Date(book.updatedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Heute";
    if (diffDays === 1) return "Gestern";
    return `Vor ${diffDays} Tagen`;
  };

  const calculateProgress = (book: Book) => {
    if (!book.currentPage || !book.pageCount) return 0;
    return Math.round((book.currentPage / book.pageCount) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-serif font-semibold">Aktuell am Lesen</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse bg-muted rounded-xl h-32" />
          <div className="animate-pulse bg-muted rounded-xl h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-serif font-semibold">Aktuell am Lesen</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Alle anzeigen
        </Button>
      </div>

      <div className="space-y-4">
        {currentBooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Keine Bücher werden gerade gelesen</p>
          </div>
        ) : (
          currentBooks.map((book, index) => (
            <div
              key={book.id}
              className="group flex gap-4 p-4 rounded-xl bg-background/50 hover:bg-background transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Book Cover */}
              <div className="relative flex-shrink-0">
                <img
                  src={book.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold text-foreground truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Seite {book.currentPage || 0} von {book.pageCount}
                    </span>
                    <span className="font-medium text-primary">{calculateProgress(book)}%</span>
                  </div>
                  <Progress value={calculateProgress(book)} className="h-2" />
                </div>

                {/* Last Read */}
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {getLastRead(book)}
                  </span>
                  <Button
                    size="sm"
                    className="h-7 gap-1 btn-nature text-xs"
                  >
                    <Play className="w-3 h-3" />
                    Weiterlesen
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
