import { useParams, useNavigate } from "react-router-dom";
import { useCollection, useAddBookToCollection, useRemoveBookFromCollection } from "@/hooks/useCollections";
import { useBooks } from "@/hooks/useBooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Plus,
  X,
  BookOpen,
  Star,
  Calendar,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [bookStatus, setBookStatus] = useState("COLLECTED");

  const { data: collection, isLoading } = useCollection(id!);
  const { data: booksResponse, isLoading: booksLoading } = useBooks();
  const books = booksResponse || [];

  const addBookMutation = useAddBookToCollection();
  const removeBookMutation = useRemoveBookFromCollection();

  if (isLoading || booksLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="p-8">
        <Card className="p-12 rounded-2xl text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Kollektion nicht gefunden</h3>
          <p className="text-muted-foreground mb-6">
            Diese Kollektion existiert nicht oder wurde gelöscht.
          </p>
          <Button onClick={() => navigate("/collections")} className="rounded-xl">
            Zurück zu Kollektionen
          </Button>
        </Card>
      </div>
    );
  }

  const progress = collection.progress;

  // Get books that are already in the collection
  const collectionBookIds = new Set(collection.books.map((bc: any) => bc.bookId));

  // Get available books to add (not in collection yet)
  const availableBooks = books.filter((book: any) => !collectionBookIds.has(book.id));

  const handleAddBook = () => {
    if (!selectedBookId) return;

    addBookMutation.mutate(
      {
        collectionId: id!,
        data: {
          bookId: selectedBookId,
          status: bookStatus,
        },
      },
      {
        onSuccess: () => {
          setOpenAddDialog(false);
          setSelectedBookId("");
          setBookStatus("COLLECTED");
        },
      }
    );
  };

  const handleRemoveBook = (bookId: string) => {
    removeBookMutation.mutate({
      collectionId: id!,
      bookId,
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      COLLECTED: { label: "Gesammelt", className: "bg-green-500/10 text-green-600 border-green-500/20" },
      WISHLIST: { label: "Wunschliste", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
      MISSING: { label: "Fehlend", className: "bg-red-500/10 text-red-600 border-red-500/20" },
      DUPLICATE: { label: "Doppelt", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    };
    const badge = badges[status as keyof typeof badges] || badges.COLLECTED;
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/collections")}
          className="mb-4 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Kollektionen
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-md">
                <Plus className="mr-2 h-5 w-5" />
                Buch hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Buch zur Kollektion hinzufügen</DialogTitle>
                <DialogDescription>
                  Wähle ein Buch aus deiner Bibliothek
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {availableBooks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">
                      Keine weiteren Bücher verfügbar
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Alle Bücher aus deiner Bibliothek sind bereits in dieser Kollektion.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buch</label>
                      <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                        <SelectTrigger className="rounded-xl h-11">
                          <SelectValue placeholder="Wähle ein Buch..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {availableBooks.map((book: any) => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.title} - {book.author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {availableBooks.length} {availableBooks.length === 1 ? 'Buch' : 'Bücher'} verfügbar
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={bookStatus} onValueChange={setBookStatus}>
                        <SelectTrigger className="rounded-xl h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COLLECTED">Gesammelt</SelectItem>
                          <SelectItem value="WISHLIST">Wunschliste</SelectItem>
                          <SelectItem value="MISSING">Fehlend</SelectItem>
                          <SelectItem value="DUPLICATE">Doppelt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setOpenAddDialog(false)}
                        className="flex-1 rounded-xl h-12"
                      >
                        Abbrechen
                      </Button>
                      <Button
                        onClick={handleAddBook}
                        className="flex-1 rounded-xl h-12"
                        disabled={!selectedBookId || addBookMutation.isPending}
                      >
                        Hinzufügen
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-6 rounded-2xl mb-8 border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fortschritt</h3>
          {progress.percentage === 100 && (
            <div className="flex items-center gap-2 text-yellow-600">
              <Star className="h-5 w-5 fill-yellow-500" />
              <span className="font-semibold">Abgeschlossen!</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sammlung</span>
            <span className="font-bold text-primary text-lg">
              {progress.collected} / {progress.total}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-3" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.collected}</div>
              <div className="text-xs text-muted-foreground">Gesammelt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{progress.wishlist}</div>
              <div className="text-xs text-muted-foreground">Wunschliste</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{progress.missing}</div>
              <div className="text-xs text-muted-foreground">Fehlend</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{progress.percentage}%</div>
              <div className="text-xs text-muted-foreground">Fortschritt</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Books Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Bücher ({collection.books.length})
        </h3>

        {collection.books.length === 0 ? (
          <Card className="p-12 rounded-2xl text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Keine Bücher</h3>
            <p className="text-muted-foreground mb-6">
              Füge Bücher zu dieser Kollektion hinzu
            </p>
            <Button onClick={() => setOpenAddDialog(true)} className="rounded-xl">
              <Plus className="mr-2 h-5 w-5" />
              Buch hinzufügen
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.books.map((bc: any) => {
              const book = bc.book;
              return (
                <Card
                  key={bc.id}
                  className="rounded-2xl overflow-hidden hover:shadow-lg transition-all border-border group"
                >
                  {/* Book Cover */}
                  {book.coverUrl ? (
                    <div className="relative h-64 bg-muted">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveBook(book.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        {getStatusBadge(bc.status)}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary opacity-50" />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveBook(book.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        {getStatusBadge(bc.status)}
                      </div>
                    </div>
                  )}

                  {/* Book Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {book.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <User className="h-3 w-3" />
                      <span className="line-clamp-1">{book.author}</span>
                    </div>
                    {book.publishedYear && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{book.publishedYear}</span>
                      </div>
                    )}
                    {bc.order && (
                      <div className="mt-2 text-xs font-medium text-primary">
                        #{bc.order}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
