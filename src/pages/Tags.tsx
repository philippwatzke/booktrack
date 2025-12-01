import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBooks } from "@/hooks/useBooks";
import { Tags as TagsIcon } from "lucide-react";

export default function Tags() {
  const { data: books = [], isLoading } = useBooks();
  const allGenres = books.flatMap((book) => book.genres || []);
  const allTags = books.flatMap((book) => book.tags || []);

  const genreCount = allGenres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tagCount = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tags & Kategorien</h1>
          <p className="text-muted-foreground">
            Organisiere deine Bücher nach Themen und Genres
          </p>
        </div>

        {/* Genres Section */}
        <Card className="p-8 rounded-2xl border-border shadow-md mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <TagsIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Genres</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(genreCount)
              .sort(([, a], [, b]) => b - a)
              .map(([genre, count]) => (
                <Badge
                  key={genre}
                  variant="default"
                  className="cursor-pointer rounded-full px-4 py-2 text-sm hover:shadow-md transition-all"
                >
                  {genre} ({count})
                </Badge>
              ))}
          </div>
        </Card>

        {/* Tags Section */}
        <Card className="p-8 rounded-2xl border-border shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
              <TagsIcon className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Tags</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(tagCount)
              .sort(([, a], [, b]) => b - a)
              .map(([tag, count]) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer rounded-full px-4 py-2 text-sm hover:shadow-md transition-all"
                >
                  {tag} ({count})
                </Badge>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
