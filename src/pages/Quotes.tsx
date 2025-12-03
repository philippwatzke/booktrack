import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Quote,
  Search,
  Plus,
  Heart,
  Share2,
  Copy,
  BookOpen,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { useAllQuotes, useDeleteQuote } from "@/hooks/useQuotes";
import { useBooks } from "@/hooks/useBooks";

export default function Quotes() {
  const { data: quotes = [], isLoading } = useAllQuotes();
  const { data: books = [] } = useBooks({});
  const deleteQuote = useDeleteQuote();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a map of bookId to book for quick lookup
  const bookMap = new Map(books.map(book => [book.id, book]));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Zitate werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
              <Quote className="w-10 h-10 text-primary" />
              Zitate
            </h1>
            <p className="text-muted-foreground">
              {quotes.length} inspirierende Zitate gesammelt
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Zitat hinzufügen
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Zitate durchsuchen..."
              className="pl-10 bg-card/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {quotes.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Quote className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Noch keine Zitate
              </h3>
              <p className="text-muted-foreground">
                Füge Zitate aus deinen Büchern hinzu
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Quotes List */
          <div className="space-y-6">
            {filteredQuotes.map((quote, index) => {
              const book = bookMap.get(quote.bookId);
              const formattedDate = new Date(quote.createdAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <Card
                  key={quote.id}
                  className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Quote Mark */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Quote className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Quote Text */}
                        <blockquote className="text-xl font-serif text-foreground mb-4 leading-relaxed">
                          "{quote.text}"
                        </blockquote>

                        {/* Source */}
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground font-medium">
                            {book?.title || "Unbekanntes Buch"}
                          </span>
                          {book && (
                            <span className="text-sm text-muted-foreground">
                              von {book.author}
                            </span>
                          )}
                          {quote.page && (
                            <span className="text-sm text-muted-foreground">
                              • Seite {quote.page}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formattedDate}
                          </span>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              onClick={() => toggleFavorite(quote.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  favorites.includes(quote.id)
                                    ? "fill-destructive text-destructive"
                                    : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(quote.text)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
