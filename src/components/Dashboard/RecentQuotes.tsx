import { Quote as QuoteIcon, BookOpen } from "lucide-react";
import { useBooks } from "@/hooks/useBooks";
import { quotesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "@/types/book";

interface QuoteWithBook extends Quote {
  book?: {
    title: string;
    author: string;
  };
}

export function RecentQuotes() {
  // Fetch all quotes
  const { data: quotesData, isLoading } = useQuery({
    queryKey: ['allQuotes'],
    queryFn: async () => {
      const response = await quotesApi.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch quotes');
      }
      return response.data as Quote[];
    },
  });

  // Get all books to match book titles
  const { data: books } = useBooks({});

  // Combine quotes with book information
  const quotesWithBooks: QuoteWithBook[] = quotesData?.slice(0, 2).map(quote => {
    const book = books?.find(b => b.id === quote.bookId);
    return {
      ...quote,
      book: book ? { title: book.title, author: book.author } : undefined,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center">
            <QuoteIcon className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="text-xl font-serif font-semibold">Letzte Zitate</h2>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse bg-muted rounded-xl h-24" />
          <div className="animate-pulse bg-muted rounded-xl h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center">
          <QuoteIcon className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-xl font-serif font-semibold">Letzte Zitate</h2>
      </div>

      <div className="space-y-4">
        {quotesWithBooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <QuoteIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Noch keine Zitate gespeichert</p>
          </div>
        ) : (
          quotesWithBooks.map((quote, index) => (
            <div
              key={quote.id}
              className="relative p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Mark */}
              <QuoteIcon className="absolute top-2 right-2 w-8 h-8 text-primary/10" />

              <p className="font-serif text-foreground italic mb-3 pr-8">
                "{quote.text}"
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{quote.book?.title || "Unbekanntes Buch"}</span>
                {quote.page && (
                  <>
                    <span className="text-border">•</span>
                    <span>S. {quote.page}</span>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
