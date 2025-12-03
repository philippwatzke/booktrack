import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search as SearchIcon,
  BookOpen,
  Star,
  Plus,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { booksApi } from "@/lib/api";
import { useCreateBook } from "@/hooks/useBooks";

const recentSearches = [
  "Stephen King",
  "Fantasy Bücher 2024",
  "Sachbuch Psychologie",
  "Romantasy",
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const createBook = useCreateBook();

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await booksApi.searchExternal(query);
      if (!response.success) {
        throw new Error(response.error || 'Suche fehlgeschlagen');
      }
      return response.data || [];
    },
    onSuccess: (data) => {
      setSearchResults(data);
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchMutation.mutate(searchQuery);
  };

  const handleAddBook = (book: any) => {
    createBook.mutate({
      title: book.title,
      author: book.authors?.[0] || "Unbekannter Autor",
      isbn: book.isbn,
      description: book.description,
      coverUrl: book.coverUrl,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      pageCount: book.pageCount || 0,
      status: "WANT_TO_READ",
    });
  };

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Bücher Suchen
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Durchsuche Millionen von Büchern mit der Google Books API und füge sie zu deiner Bibliothek hinzu
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in delay-100">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Suche nach Titel, Autor oder ISBN..."
              className="pl-12 pr-28 h-14 text-lg bg-card/80 backdrop-blur-sm border-2 border-border focus:border-primary rounded-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
              onClick={handleSearch}
              disabled={searchMutation.isPending}
            >
              {searchMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Suchen"
              )}
            </Button>
          </div>

          {/* Recent Searches */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="text-sm text-muted-foreground">Letzte Suchen:</span>
            {recentSearches.map((search) => (
              <Badge
                key={search}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchMutation.isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Suche läuft...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="animate-fade-in delay-200">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-warm" />
              Suchergebnisse ({searchResults.length})
            </h2>

            <div className="space-y-4">
              {searchResults.map((book, index) => (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${(index + 3) * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <img
                        src={book.coverUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop"}
                        alt={book.title}
                        className="w-24 h-36 object-cover"
                      />

                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-foreground mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {book.authors?.join(", ") || "Unbekannter Autor"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => handleAddBook(book)}
                              disabled={createBook.isPending}
                            >
                              <Plus className="w-4 h-4" />
                              Hinzufügen
                            </Button>
                            {book.infoLink && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(book.infoLink, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {book.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {book.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          {book.averageRating && (
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-amber-warm text-amber-warm" />
                              {book.averageRating}
                            </span>
                          )}
                          {book.pageCount && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <BookOpen className="w-4 h-4" />
                              {book.pageCount} Seiten
                            </span>
                          )}
                          {book.categories && book.categories.length > 0 && (
                            <Badge variant="outline">{book.categories[0]}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : searchQuery && !searchMutation.isPending ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Keine Ergebnisse gefunden
              </h3>
              <p className="text-muted-foreground">
                Versuche es mit einem anderen Suchbegriff
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </MainLayout>
  );
}
