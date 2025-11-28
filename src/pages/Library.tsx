import { useState } from "react";
import { BookCard } from "@/components/Books/BookCard";
import { mockBooks } from "@/data/mockBooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate();

  const allGenres = Array.from(
    new Set(mockBooks.flatMap((book) => book.genres || []))
  );

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre =
      !selectedGenre || book.genres?.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Bibliothek</h1>
              <p className="text-muted-foreground">
                {filteredBooks.length} {filteredBooks.length === 1 ? "Buch" : "Bücher"} gefunden
              </p>
            </div>
            <Button className="rounded-xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all">
              <Plus className="mr-2 h-5 w-5" />
              Buch hinzufügen
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Suche nach Titel oder Autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-border bg-card shadow-sm"
              />
            </div>
            <Button 
              variant="outline" 
              className="rounded-xl h-12 px-6 border-border shadow-sm"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </div>

          {/* Genre Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant={selectedGenre === null ? "default" : "secondary"}
              className="cursor-pointer rounded-full px-4 py-1.5 transition-all hover:shadow-md"
              onClick={() => setSelectedGenre(null)}
            >
              Alle
            </Badge>
            {allGenres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "default" : "secondary"}
                className="cursor-pointer rounded-full px-4 py-1.5 transition-all hover:shadow-md"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/book/${book.id}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keine Bücher gefunden
            </h3>
            <p className="text-muted-foreground">
              Versuche es mit anderen Suchbegriffen oder Filtern
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
