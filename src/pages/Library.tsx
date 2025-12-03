import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  BookOpen,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { useNavigate } from "react-router-dom";

const statusLabels: Record<string, string> = {
  FINISHED: "Gelesen",
  READING: "Lese ich",
  WANT_TO_READ: "Wunschliste",
};

const statusColors: Record<string, string> = {
  FINISHED: "bg-primary text-primary-foreground",
  READING: "bg-amber-warm text-accent-foreground",
  WANT_TO_READ: "bg-secondary text-secondary-foreground",
};

export default function Library() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: books = [], isLoading } = useBooks({});

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (book: any) => {
    if (!book.currentPage || !book.pageCount) return 0;
    return Math.round((book.currentPage / book.pageCount) * 100);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
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
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Meine Bibliothek
            </h1>
            <p className="text-muted-foreground">
              {books.length} Bücher in deiner Sammlung
            </p>
          </div>

          <Button className="gap-2" onClick={() => navigate('/library')}>
            <Plus className="w-4 h-4" />
            Buch hinzufügen
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Bücher durchsuchen..."
              className="pl-10 bg-card/80 backdrop-blur-sm border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Book Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book, index) => (
              <Card
                key={book.id}
                className="group overflow-hidden bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Badge
                    className={`absolute top-2 right-2 ${statusColors[book.status]}`}
                  >
                    {statusLabels[book.status]}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold text-foreground truncate mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {book.author}
                  </p>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (book.rating || 0)
                            ? "fill-amber-warm text-amber-warm"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {book.status === "READING" && (
                    <div className="space-y-1">
                      <Progress
                        value={calculateProgress(book)}
                        className="h-1.5"
                      />
                      <p className="text-xs text-muted-foreground">
                        {book.currentPage} / {book.pageCount} Seiten
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map((book, index) => (
              <Card
                key={book.id}
                className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <CardContent className="p-4 flex gap-4">
                  <img
                    src={book.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop"}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-semibold text-foreground truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                      <Badge className={statusColors[book.status]}>
                        {statusLabels[book.status]}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < (book.rating || 0)
                                ? "fill-amber-warm text-amber-warm"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      {book.genres && book.genres.length > 0 && (
                        <Badge variant="outline">{book.genres[0]}</Badge>
                      )}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {book.pageCount} Seiten
                      </span>
                    </div>

                    {book.status === "READING" && (
                      <div className="mt-2 flex items-center gap-3">
                        <Progress
                          value={calculateProgress(book)}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {calculateProgress(book)}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keine Bücher gefunden
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Versuche es mit anderen Suchbegriffen" : "Füge dein erstes Buch hinzu"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
