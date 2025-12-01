import { useState, useMemo } from "react";
import { BookCard } from "@/components/Books/BookCard";
import { useBooks } from "@/hooks/useBooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddBookDialog } from "@/components/Books/AddBookDialog";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const navigate = useNavigate();

  const { data: books = [], isLoading, error } = useBooks();

  const allGenres = useMemo(() =>
    Array.from(new Set(books.flatMap((book) => book.genres || []))),
    [books]
  );

  const filteredBooks = useMemo(() =>
    books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        !selectedGenre || book.genres?.includes(selectedGenre);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(book.status);
      return matchesSearch && matchesGenre && matchesStatus;
    }),
    [books, searchQuery, selectedGenre, selectedStatuses]
  );

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Bücher werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Fehler beim Laden der Bücher</p>
          <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
        </div>
      </div>
    );
  }

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
            <AddBookDialog />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl h-12 px-6 border-border shadow-sm"
                >
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Filter
                  {selectedStatuses.length > 0 && (
                    <Badge variant="default" className="ml-2 rounded-full px-2 py-0 text-xs">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Status filtern</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedStatuses.includes("WANT_TO_READ")}
                  onCheckedChange={() => toggleStatus("WANT_TO_READ")}
                >
                  Wunschliste
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatuses.includes("READING")}
                  onCheckedChange={() => toggleStatus("READING")}
                >
                  Aktuell lesen
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatuses.includes("FINISHED")}
                  onCheckedChange={() => toggleStatus("FINISHED")}
                >
                  Gelesen
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
