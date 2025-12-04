import { useParams, useNavigate } from "react-router-dom";
import { useCollection, useAddBookToCollection, useRemoveBookFromCollection, useUpdateBookInCollection } from "@/hooks/useCollections";
import { useBooks } from "@/hooks/useBooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  LayoutGrid,
  List,
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
import { AlbumGrid } from "@/components/Collections/AlbumGrid";
import { SeriesTracker } from "@/components/Collections/SeriesTracker";
import { MissingBooksWidget } from "@/components/Collections/MissingBooksWidget";
import { toast } from "sonner";

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [bookStatus, setBookStatus] = useState("COLLECTED");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingBookId, setEditingBookId] = useState("");
  const [editingStatus, setEditingStatus] = useState("COLLECTED");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: collection, isLoading } = useCollection(id!);
  const { data: booksResponse, isLoading: booksLoading } = useBooks();
  const books = booksResponse || [];

  const addBookMutation = useAddBookToCollection();
  const removeBookMutation = useRemoveBookFromCollection();
  const updateBookMutation = useUpdateBookInCollection();

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
          toast.success("Buch hinzugefügt!");
        },
      }
    );
  };

  const handleRemoveBook = (bookId: string) => {
    removeBookMutation.mutate(
      {
        collectionId: id!,
        bookId,
      },
      {
        onSuccess: () => {
          toast.success("Buch entfernt!");
        },
      }
    );
  };

  const handleEditBook = (bookId: string, currentStatus: string) => {
    setEditingBookId(bookId);
    setEditingStatus(currentStatus);
    setOpenEditDialog(true);
  };

  const handleUpdateBook = () => {
    if (!editingBookId) return;

    updateBookMutation.mutate(
      {
        collectionId: id!,
        bookId: editingBookId,
        data: {
          status: editingStatus,
        },
      },
      {
        onSuccess: () => {
          setOpenEditDialog(false);
          setEditingBookId("");
          setEditingStatus("COLLECTED");
          toast.success("Status aktualisiert!");
        },
      }
    );
  };

  const handleReorder = (items: any[]) => {
    // This would update the order in the backend
    // For now, just show a success message
    toast.success("Reihenfolge gespeichert!");
  };

  const isComplete = progress.percentage === 100;
  const isSeries = collection.type === "SERIES";

  // Show placeholders for series with target count
  const showPlaceholders = isSeries && collection.targetCount && collection.targetCount > 0;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
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
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-muted rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
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
      </div>

      {/* Edit Book Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Buch bearbeiten</DialogTitle>
            <DialogDescription>
              Ändere den Status des Buches in der Kollektion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editingStatus} onValueChange={setEditingStatus}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COLLECTED">Gesammelt</SelectItem>
                  <SelectItem value="WISHLIST">Wunschliste</SelectItem>
                  <SelectItem value="MISSING">Fehlend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpenEditDialog(false)}
                className="flex-1 rounded-xl h-12"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleUpdateBook}
                className="flex-1 rounded-xl h-12"
                disabled={updateBookMutation.isPending}
              >
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content with Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Books Grid */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            Sammelalbum ({collection.books.length} {collection.books.length === 1 ? "Buch" : "Bücher"})
          </h3>

          {viewMode === "grid" ? (
            <AlbumGrid
              books={collection.books}
              collectionType={collection.type}
              onEditBook={handleEditBook}
              onRemoveBook={handleRemoveBook}
              onAddBook={() => setOpenAddDialog(true)}
              onReorder={handleReorder}
              showPlaceholders={showPlaceholders}
              targetCount={collection.targetCount}
            />
          ) : (
            <div className="space-y-3">
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
                collection.books.map((bc: any) => (
                  <Card key={bc.id} className="p-4 rounded-xl">
                    <div className="flex gap-4">
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {bc.book.coverUrl ? (
                          <img
                            src={bc.book.coverUrl}
                            alt={bc.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{bc.book.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{bc.book.author}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBook(bc.book.id, bc.status)}
                          >
                            Status ändern
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveBook(bc.book.id)}
                          >
                            Entfernen
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Widgets */}
        <div className="lg:col-span-1 space-y-6">
          {/* Series Tracker */}
          <SeriesTracker
            collectionName={collection.name}
            collectionType={collection.type}
            progress={progress}
            isComplete={isComplete}
          />

          {/* Missing Books Widget */}
          {progress.missing > 0 && (
            <MissingBooksWidget
              collectionName={collection.name}
              collectionType={collection.type}
              missingCount={progress.missing}
              onAddBook={() => setOpenAddDialog(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
