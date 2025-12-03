import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  ExternalLink,
  Star,
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { useUpdateBook, useDeleteBook } from "@/hooks/useBooks";
import { useNavigate } from "react-router-dom";

const priorityColors: Record<string, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-amber-warm/20 text-amber-glow border-amber-warm/30",
  low: "bg-secondary text-secondary-foreground border-secondary",
};

const priorityLabels: Record<string, string> = {
  high: "Hohe Priorität",
  medium: "Mittlere Priorität",
  low: "Niedrige Priorität",
};

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: books = [], isLoading } = useBooks({ status: "WANT_TO_READ" });
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const getPriorityLevel = (priority?: number) => {
    if (!priority) return "low";
    if (priority >= 4) return "high";
    if (priority >= 2) return "medium";
    return "low";
  };

  const handleStartReading = (bookId: string) => {
    updateBook.mutate({ id: bookId, data: { status: "READING" } });
  };

  const handleDelete = (bookId: string) => {
    if (confirm("Möchtest du dieses Buch wirklich von deiner Wunschliste entfernen?")) {
      deleteBook.mutate(bookId);
    }
  };

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

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
              <Heart className="w-10 h-10 text-destructive fill-destructive/20" />
              Wunschliste
            </h1>
            <p className="text-muted-foreground">
              {books.length} Bücher warten darauf, gelesen zu werden
            </p>
          </div>

          <Button className="gap-2" onClick={() => navigate("/search")}>
            <Plus className="w-4 h-4" />
            Buch hinzufügen
          </Button>
        </div>

        {books.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Deine Wunschliste ist leer
              </h3>
              <p className="text-muted-foreground">
                Füge Bücher hinzu, die du gerne lesen möchtest
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book, index) => {
              const priorityLevel = getPriorityLevel(book.priority);
              const formattedDate = new Date(book.createdAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <Card
                  key={book.id}
                  className="group bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative w-32 flex-shrink-0">
                        <img
                          src={book.coverUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                      </div>

                      <div className="flex-1 p-5 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-foreground line-clamp-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="outline" className={priorityColors[priorityLevel]}>
                            {priorityLabels[priorityLevel]}
                          </Badge>
                          {book.genres && book.genres.length > 0 && (
                            <Badge variant="outline">{book.genres[0]}</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          {book.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-warm text-amber-warm" />
                              {book.rating}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {book.pageCount} Seiten
                          </span>
                        </div>

                        <div className="mt-auto flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => handleStartReading(book.id)}
                          >
                            <BookOpen className="w-4 h-4" />
                            Lesen starten
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => navigate(`/book/${book.id}`)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-3">
                          Hinzugefügt am {formattedDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
