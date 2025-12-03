import { Book } from "@/types/book";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getGenreColorConsistent } from "@/lib/genreColors";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const progressPercent = book.currentPage && book.pageCount 
    ? Math.round((book.currentPage / book.pageCount) * 100)
    : 0;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-light to-accent-light">
            <span className="text-4xl font-bold text-primary/30">{book.title[0]}</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {book.status === "READING" && (
            <Badge className="bg-accent text-accent-foreground shadow-md">
              <Clock className="mr-1 h-3 w-3" />
              Lese ich
            </Badge>
          )}
          {book.status === "FINISHED" && book.rating && (
            <Badge className="bg-primary text-primary-foreground shadow-md">
              <Star className="mr-1 h-3 w-3 fill-current" />
              {book.rating}
            </Badge>
          )}
        </div>

        {/* Progress Bar for Reading */}
        {book.status === "READING" && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20 backdrop-blur-sm">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-card-foreground mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

        {/* Progress Info for Reading Books */}
        {book.status === "READING" && book.currentPage !== undefined && book.pageCount && (
          <div className="mb-3 pb-3 border-b border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {book.currentPage} / {book.pageCount} Seiten
              </span>
              <span className="font-semibold text-primary">
                {progressPercent}%
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {book.genres && book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {book.genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className={`text-xs rounded-full px-2 py-0.5 border ${getGenreColorConsistent(genre)}`}
              >
                {genre}
              </Badge>
            ))}
            {book.genres.length > 2 && (
              <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                +{book.genres.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
