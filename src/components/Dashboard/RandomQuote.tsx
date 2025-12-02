import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { quotesApi } from "@/lib/api";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Quote {
  id: string;
  text: string;
  page?: number;
  bookId: string;
  book?: {
    title: string;
    author: string;
  };
}

export function RandomQuote() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: allQuotes = [], isLoading } = useQuery({
    queryKey: ['allQuotes', refreshKey],
    queryFn: async () => {
      const response = await quotesApi.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch quotes');
      }
      return response.data as Quote[];
    },
  });

  // Get random quote
  const randomQuote = allQuotes.length > 0
    ? allQuotes[Math.floor(Math.random() * allQuotes.length)]
    : null;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-border shadow-md break-inside-avoid">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!randomQuote) {
    return (
      <Card className="p-6 rounded-2xl border-border border-dashed text-center break-inside-avoid">
        <QuoteIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">
          Noch keine Zitate gespeichert.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Füge dein erstes Zitat hinzu!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-accent/5 break-inside-avoid">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <QuoteIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Zitat des Tages</h3>
            <p className="text-xs text-muted-foreground">Aus deiner Sammlung</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-8 w-8 p-0 rounded-lg"
          title="Neues Zitat"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <blockquote className="relative pl-4 border-l-4 border-primary">
        <p className="text-foreground italic leading-relaxed mb-3">
          "{randomQuote.text}"
        </p>
        <footer className="text-sm text-muted-foreground">
          <cite className="not-italic font-medium">
            {randomQuote.book?.title || 'Unbekanntes Buch'}
          </cite>
          {randomQuote.book?.author && (
            <span className="block text-xs mt-1">
              von {randomQuote.book.author}
            </span>
          )}
          {randomQuote.page && (
            <span className="block text-xs mt-1 text-primary">
              Seite {randomQuote.page}
            </span>
          )}
        </footer>
      </blockquote>
    </Card>
  );
}
