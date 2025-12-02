import { useState } from "react";
import { useCollections, useUserSeries, useCreateCollection, useCreateSeries } from "@/hooks/useCollections";
import { useBooks } from "@/hooks/useBooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  BookOpen,
  User,
  Calendar,
  Tag,
  TrendingUp,
  Grid3x3,
  List,
  Star,
  Book,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLLECTION_TYPES = [
  { value: "GENRE", label: "Genre", icon: Tag },
  { value: "AUTHOR", label: "Autor", icon: User },
  { value: "SERIES", label: "Reihe", icon: BookOpen },
  { value: "THEME", label: "Thema", icon: TrendingUp },
  { value: "YEAR", label: "Jahr", icon: Calendar },
];

export default function Collections() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openCreateSeriesDialog, setOpenCreateSeriesDialog] = useState(false);

  // Form state for collections
  const [type, setType] = useState("GENRE");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetCount, setTargetCount] = useState("");

  // Form state for series
  const [seriesName, setSeriesName] = useState("");
  const [seriesAuthor, setSeriesAuthor] = useState("");
  const [seriesTotalBooks, setSeriesTotalBooks] = useState("");

  const { data: collections = [], isLoading } = useCollections();
  const { data: userSeries = [] } = useUserSeries();
  const { data: booksResponse } = useBooks();
  const books = booksResponse || [];

  const createCollection = useCreateCollection();
  const createSeries = useCreateSeries();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCollection.mutate(
      {
        type,
        name,
        description: description || undefined,
        targetCount: targetCount ? parseInt(targetCount) : undefined,
      },
      {
        onSuccess: () => {
          setOpenCreateDialog(false);
          setName("");
          setDescription("");
          setTargetCount("");
        },
      }
    );
  };

  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();

    createSeries.mutate(
      {
        name: seriesName,
        author: seriesAuthor || undefined,
        totalBooks: seriesTotalBooks ? parseInt(seriesTotalBooks) : undefined,
      },
      {
        onSuccess: () => {
          setOpenCreateSeriesDialog(false);
          setSeriesName("");
          setSeriesAuthor("");
          setSeriesTotalBooks("");
        },
      }
    );
  };

  // Auto-generate collections suggestions
  const getAutoCollectionSuggestions = () => {
    const suggestions = [];

    // Genre collections
    const genres = new Set<string>();
    books.forEach((book: any) => {
      if (book.genres) {
        try {
          const bookGenres = JSON.parse(book.genres);
          bookGenres.forEach((g: string) => genres.add(g));
        } catch (e) {
          // Ignore
        }
      }
    });
    genres.forEach((genre) => {
      const genreBooks = books.filter((b: any) => {
        try {
          const bookGenres = JSON.parse(b.genres || "[]");
          return bookGenres.includes(genre);
        } catch {
          return false;
        }
      });
      if (genreBooks.length > 0) {
        suggestions.push({
          type: "GENRE",
          name: genre,
          count: genreBooks.length,
        });
      }
    });

    // Author collections
    const authors = new Map<string, number>();
    books.forEach((book: any) => {
      authors.set(book.author, (authors.get(book.author) || 0) + 1);
    });
    Array.from(authors.entries())
      .filter(([, count]) => count > 1)
      .forEach(([author, count]) => {
        suggestions.push({
          type: "AUTHOR",
          name: `${author} Collection`,
          count,
        });
      });

    return suggestions.slice(0, 6);
  };

  const suggestions = getAutoCollectionSuggestions();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Grid3x3 className="h-8 w-8 text-primary" />
            Sammelalbum
          </h1>
          <p className="text-muted-foreground">
            Organisiere deine Bücher in thematischen Kollektionen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-xl p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className="rounded-lg"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-lg"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-md">
                <Plus className="mr-2 h-5 w-5" />
                Neue Kollektion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Neue Kollektion erstellen</DialogTitle>
                <DialogDescription>
                  Erstelle eine Kollektion, um deine Bücher zu organisieren
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Typ *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLLECTION_TYPES.map((ct) => (
                        <SelectItem key={ct.value} value={ct.value}>
                          <div className="flex items-center gap-2">
                            <ct.icon className="h-4 w-4" />
                            {ct.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="z.B. Fantasy-Klassiker, Stephen King..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea
                    id="description"
                    placeholder="Worum geht es in dieser Kollektion?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCount">Ziel-Anzahl</Label>
                  <Input
                    id="targetCount"
                    type="number"
                    placeholder="Wie viele Bücher sollen es werden?"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreateDialog(false)}
                    className="flex-1 rounded-xl h-12"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl h-12"
                    disabled={createCollection.isPending}
                  >
                    Erstellen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="rounded-xl mb-6">
          <TabsTrigger value="collections" className="rounded-lg">
            <Grid3x3 className="h-4 w-4 mr-2" />
            Kollektionen
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-lg">
            <BookOpen className="h-4 w-4 mr-2" />
            Reihen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          {collections.length === 0 ? (
            <Card className="p-12 rounded-2xl text-center">
              <Grid3x3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Keine Kollektionen</h3>
              <p className="text-muted-foreground mb-6">
                Erstelle deine erste Kollektion, um Bücher zu organisieren
              </p>

              {suggestions.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                    Vorschläge basierend auf deiner Bibliothek:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {suggestions.map((sug, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="rounded-xl h-auto py-4"
                        onClick={() => {
                          setType(sug.type);
                          setName(sug.name);
                          setOpenCreateDialog(true);
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{sug.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {sug.count} Bücher
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {collections.map((collection: any) => {
                const TypeIcon = COLLECTION_TYPES.find((ct) => ct.value === collection.type)?.icon || Tag;
                const progress = collection.progress;

                return (
                  <Card
                    key={collection.id}
                    className="p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer border-border"
                    onClick={() => window.location.href = `/collections/${collection.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <TypeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{collection.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {COLLECTION_TYPES.find((ct) => ct.value === collection.type)?.label}
                          </p>
                        </div>
                      </div>
                      {progress.percentage === 100 && (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    {collection.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="font-bold text-primary">
                          {progress.collected} / {progress.total}
                        </span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>✅ {progress.collected} Gesammelt</span>
                        {progress.wishlist > 0 && <span>⭐ {progress.wishlist} Wunschliste</span>}
                        {progress.missing > 0 && <span>❌ {progress.missing} Fehlend</span>}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="series" className="space-y-6">
          {userSeries.length === 0 ? (
            <Card className="p-12 rounded-2xl text-center">
              <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Keine Reihen</h3>
              <p className="text-muted-foreground mb-6">
                Erstelle Reihen, um deine Buchserien zu organisieren
              </p>
              <Button onClick={() => setOpenCreateSeriesDialog(true)} className="rounded-xl">
                <Plus className="mr-2 h-5 w-5" />
                Neue Reihe erstellen
              </Button>
            </Card>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {userSeries.map((series: any) => {
                const progress = series.progress;

                return (
                  <Card
                    key={series.id}
                    className="p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer border-border"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{series.name}</h3>
                        {series.author && (
                          <p className="text-sm text-muted-foreground">von {series.author}</p>
                        )}
                      </div>
                      {progress.percentage === 100 && (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="font-bold text-primary">
                          {progress.owned} / {progress.total}
                        </span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {progress.owned} von {progress.total} Büchern gelesen
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Series Dialog */}
      <Dialog open={openCreateSeriesDialog} onOpenChange={setOpenCreateSeriesDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Neue Reihe erstellen</DialogTitle>
            <DialogDescription>
              Erstelle eine Reihe, um deine Buchserien zu organisieren
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSeries} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="seriesName">Name der Reihe *</Label>
              <Input
                id="seriesName"
                placeholder="z.B. Harry Potter, Der Herr der Ringe..."
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                className="rounded-xl h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seriesAuthor">Autor</Label>
              <Input
                id="seriesAuthor"
                placeholder="Autor der Reihe"
                value={seriesAuthor}
                onChange={(e) => setSeriesAuthor(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seriesTotalBooks">Anzahl Bücher in der Reihe</Label>
              <Input
                id="seriesTotalBooks"
                type="number"
                placeholder="Wie viele Bücher umfasst die Reihe?"
                value={seriesTotalBooks}
                onChange={(e) => setSeriesTotalBooks(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateSeriesDialog(false)}
                className="flex-1 rounded-xl h-12"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-12"
                disabled={createSeries.isPending}
              >
                Erstellen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
