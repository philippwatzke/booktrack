import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, Plus, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface MissingBook {
  title?: string;
  author?: string;
  position?: number;
  reason: string;
}

interface MissingBooksWidgetProps {
  collectionName: string;
  collectionType: string;
  missingCount: number;
  missingBooks?: MissingBook[];
  onSearchAPI?: (query: string) => void;
  onAddBook?: () => void;
}

export function MissingBooksWidget({
  collectionName,
  collectionType,
  missingCount,
  missingBooks = [],
  onSearchAPI,
  onAddBook,
}: MissingBooksWidgetProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchAPI = async (book: MissingBook) => {
    setIsSearching(true);
    try {
      const searchQuery = book.title
        ? `${book.title} ${book.author || ""}`
        : `${collectionName} ${book.author || ""}`;

      if (onSearchAPI) {
        onSearchAPI(searchQuery);
      } else {
        // Default: Open Google Books search in new tab
        const encodedQuery = encodeURIComponent(searchQuery.trim());
        window.open(
          `https://www.google.com/search?q=${encodedQuery}+book`,
          "_blank"
        );
      }

      toast.success("Suche geöffnet!");
    } catch (error) {
      toast.error("Fehler beim Suchen");
    } finally {
      setIsSearching(false);
    }
  };

  const getSuggestions = () => {
    const suggestions = [];

    if (collectionType === "SERIES") {
      suggestions.push({
        text: `Schaue in der Google Books API nach weiteren Bänden von "${collectionName}"`,
        action: "search_series",
      });
    } else if (collectionType === "AUTHOR") {
      suggestions.push({
        text: `Finde weitere Bücher des Autors in der Google Books API`,
        action: "search_author",
      });
    } else if (collectionType === "GENRE") {
      suggestions.push({
        text: `Entdecke mehr ${collectionName}-Bücher`,
        action: "search_genre",
      });
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  if (missingCount === 0) {
    return null;
  }

  return (
    <Card className="p-6 rounded-2xl border-border bg-gradient-to-br from-red-500/5 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-foreground">
              Was fehlt noch?
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {missingCount} {missingCount === 1 ? "Buch fehlt" : "Bücher fehlen"} in dieser Sammlung
          </p>
        </div>

        <Badge variant="destructive" className="text-lg px-3 py-1">
          {missingCount}
        </Badge>
      </div>

      {/* Missing Books List */}
      {missingBooks.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Fehlende Bücher:
          </h4>
          {missingBooks.map((book, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex-1">
                {book.title && (
                  <p className="text-sm font-medium text-foreground mb-1">
                    {book.title}
                  </p>
                )}
                {book.author && (
                  <p className="text-xs text-muted-foreground mb-1">
                    von {book.author}
                  </p>
                )}
                {book.position && (
                  <Badge variant="outline" className="text-xs">
                    Band #{book.position}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {book.reason}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="rounded-lg ml-2"
                onClick={() => handleSearchAPI(book)}
                disabled={isSearching}
              >
                <Search className="h-3 w-3 mr-1" />
                Suchen
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium text-foreground">
              Vorschläge zum Vervollständigen
            </h4>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {suggestion.text}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  className="rounded-lg"
                  onClick={() => {
                    const searchQuery = collectionType === "AUTHOR"
                      ? collectionName.replace(" Collection", "")
                      : collectionName;
                    handleSearchAPI({
                      author: collectionType === "AUTHOR" ? searchQuery : undefined,
                      reason: "API-Vorschlag",
                    });
                  }}
                  disabled={isSearching}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Suchen
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          onClick={onAddBook}
          variant="outline"
          className="w-full rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buch manuell hinzufügen
        </Button>
      </div>
    </Card>
  );
}
