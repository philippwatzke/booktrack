import { Card } from "@/components/ui/card";
import { Quote as QuoteIcon, BookOpen } from "lucide-react";
import { quotesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "@/types/book";
import { useNavigate } from "react-router-dom";

export default function Quotes() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['allQuotes'],
    queryFn: async () => {
      const result = await quotesApi.getAll();
      return result;
    },
  });

  const quotes = (response?.success ? response.data : []) as Quote[];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Zitate werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Alle Zitate</h1>
          <p className="text-muted-foreground">
            {quotes.length} {quotes.length === 1 ? 'Zitat' : 'Zitate'} aus deinen Büchern
          </p>
        </div>

        {/* Quotes List */}
        {quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card
                key={quote.id}
                className="p-6 rounded-2xl border-border hover:shadow-md transition-all bg-gradient-to-br from-primary-light/10 to-accent-light/10 cursor-pointer"
                onClick={() => navigate(`/book/${quote.bookId}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {quote.book && (
                      <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {quote.book.title}
                        {quote.book.author && (
                          <span className="text-muted-foreground ml-1">
                            · {quote.book.author}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {quote.page && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Seite {quote.page}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="relative">
                  <QuoteIcon className="absolute -left-2 -top-2 h-8 w-8 text-primary/20" />
                  <blockquote className="pl-6 text-foreground leading-relaxed italic text-lg">
                    "{quote.text}"
                  </blockquote>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 rounded-2xl border-border text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <QuoteIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Noch keine Zitate gespeichert
            </h3>
            <p className="text-muted-foreground mb-6">
              Markiere inspirierende Passagen beim Lesen und speichere sie hier
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Öffne ein Buch, um Zitate hinzuzufügen</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
