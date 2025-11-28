import { Card } from "@/components/ui/card";
import { mockBooks } from "@/data/mockBooks";
import { 
  BookOpen, 
  BookCheck, 
  BookmarkPlus, 
  TrendingUp,
  Clock,
  Star
} from "lucide-react";

export default function Stats() {
  const totalBooks = mockBooks.length;
  const readingBooks = mockBooks.filter((b) => b.status === "READING").length;
  const finishedBooks = mockBooks.filter((b) => b.status === "FINISHED").length;
  const wishlistBooks = mockBooks.filter((b) => b.status === "WANT_TO_READ").length;

  const totalPagesRead = mockBooks
    .filter((b) => b.status === "FINISHED")
    .reduce((sum, b) => sum + b.pageCount, 0);

  const averageRating = mockBooks
    .filter((b) => b.rating)
    .reduce((sum, b, _, arr) => sum + (b.rating || 0) / arr.length, 0)
    .toFixed(1);

  const genreCount = mockBooks
    .flatMap((b) => b.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Statistiken</h1>
          <p className="text-muted-foreground">Deine Lese-Übersicht auf einen Blick</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Gesamte Bücher</p>
            <p className="text-4xl font-bold text-foreground">{totalBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookCheck className="h-6 w-6 text-accent" />
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Gelesen</p>
            <p className="text-4xl font-bold text-foreground">{finishedBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Aktuell lesen</p>
            <p className="text-4xl font-bold text-foreground">{readingBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookmarkPlus className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Wunschliste</p>
            <p className="text-4xl font-bold text-foreground">{wishlistBooks}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Seiten gelesen</p>
            <p className="text-4xl font-bold text-foreground">{totalPagesRead.toLocaleString()}</p>
          </Card>

          <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent fill-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Ø Bewertung</p>
            <p className="text-4xl font-bold text-foreground">{averageRating}</p>
          </Card>
        </div>

        {/* Genre Distribution */}
        <Card className="p-8 rounded-2xl border-border shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">Top Genres</h2>
          <div className="space-y-4">
            {topGenres.map(([genre, count], index) => {
              const percentage = (count / totalBooks) * 100;
              return (
                <div key={genre}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{genre}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "Buch" : "Bücher"} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index % 2 === 0 ? "bg-primary" : "bg-accent"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
