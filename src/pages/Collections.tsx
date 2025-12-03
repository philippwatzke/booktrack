import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollections, useCreateCollection } from "@/hooks/useCollections";
import { useBooks } from "@/hooks/useBooks";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  Plus,
  MoreHorizontal,
  Folder,
  Lock,
  BookOpen,
  User,
  Calendar,
  Tag,
  TrendingUp,
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

const COLLECTION_TYPES = [
  { value: "GENRE", label: "Genre", icon: Tag },
  { value: "AUTHOR", label: "Autor", icon: User },
  { value: "SERIES", label: "Reihe", icon: BookOpen },
  { value: "THEME", label: "Thema", icon: TrendingUp },
  { value: "YEAR", label: "Jahr", icon: Calendar },
];

// Color gradients for collection types
const COLLECTION_COLORS: Record<string, string> = {
  GENRE: "from-primary to-forest-light",
  AUTHOR: "from-amber-warm to-amber-glow",
  SERIES: "from-nature-water to-nature-water-light",
  THEME: "from-secondary to-muted",
  YEAR: "from-purple-600 to-purple-400",
};

export default function Collections() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [type, setType] = useState("GENRE");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetCount, setTargetCount] = useState("");

  const navigate = useNavigate();
  const { data: collections = [], isLoading } = useCollections();
  const { data: booksResponse } = useBooks();
  const books = booksResponse || [];

  const createCollection = useCreateCollection();

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

  // Get book covers for collection preview
  const getCollectionCovers = (collection: any) => {
    const collectionBooks = books.filter((book: any) => {
      if (collection.type === "AUTHOR") {
        return book.author === collection.name || book.author.includes(collection.name);
      }
      if (collection.type === "GENRE") {
        try {
          const genres = JSON.parse(book.genres || "[]");
          return genres.includes(collection.name);
        } catch {
          return false;
        }
      }
      if (collection.type === "SERIES") {
        return book.series === collection.name;
      }
      return false;
    });

    return collectionBooks
      .slice(0, 3)
      .map((book: any) => book.coverUrl)
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
              <BookMarked className="w-10 h-10 text-primary" />
              Kollektionen
            </h1>
            <p className="text-muted-foreground">
              Organisiere deine Bücher in thematischen Sammlungen
            </p>
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg">
                <Plus className="w-4 h-4" />
                Neue Kollektion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">
                  Neue Kollektion erstellen
                </DialogTitle>
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

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection: any, index: number) => {
            const TypeIcon =
              COLLECTION_TYPES.find((ct) => ct.value === collection.type)?.icon || Tag;
            const covers = getCollectionCovers(collection);
            const colorGradient =
              COLLECTION_COLORS[collection.type] || "from-primary to-forest-light";
            const progress = collection.progress || {
              collected: 0,
              wishlist: 0,
              missing: 0,
              total: 0,
              percentage: 0,
            };

            return (
              <Card
                key={collection.id}
                className="group bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                {/* Cover Stack with Gradient Background */}
                <div className={`relative h-32 bg-gradient-to-br ${colorGradient} p-4`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative flex items-end h-full">
                    {covers.length > 0 ? (
                      <div className="flex -space-x-8">
                        {covers.map((cover, i) => (
                          <img
                            key={i}
                            src={cover}
                            alt=""
                            className="w-16 h-24 object-cover rounded-md shadow-lg border-2 border-background transition-transform group-hover:translate-y-1"
                            style={{
                              transform: `rotate(${(i - 1) * 5}deg)`,
                              zIndex: 3 - i,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <TypeIcon className="w-12 h-12 text-white/60" />
                      </div>
                    )}
                  </div>

                  {progress.percentage === 100 && (
                    <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                      Komplett
                    </Badge>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-foreground line-clamp-1">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {COLLECTION_TYPES.find((ct) => ct.value === collection.type)?.label}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit/delete actions
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {collection.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="gap-1">
                      <Folder className="w-3 h-3" />
                      {progress.total} Bücher
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Collection Card */}
          <Card
            className="bg-card/40 backdrop-blur-sm border-dashed border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer animate-fade-in flex items-center justify-center min-h-[280px]"
            style={{ animationDelay: `${collections.length * 100}ms` }}
            onClick={() => setOpenCreateDialog(true)}
          >
            <CardContent className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                Neue Kollektion erstellen
              </h3>
              <p className="text-sm text-muted-foreground">
                Organisiere deine Bücher nach Themen
              </p>
            </CardContent>
          </Card>
        </div>

        {collections.length === 0 && (
          <Card className="p-12 rounded-2xl text-center bg-card/80 backdrop-blur-sm">
            <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-serif font-semibold mb-2">Keine Kollektionen</h3>
            <p className="text-muted-foreground mb-6">
              Erstelle deine erste Kollektion, um Bücher zu organisieren
            </p>
            <Button onClick={() => setOpenCreateDialog(true)} className="shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Erste Kollektion erstellen
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
