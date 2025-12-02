import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Plus, Search, Loader2, BookOpen, ArrowLeft, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BookStatus } from "@/types/book";
import { useCreateBook } from "@/hooks/useBooks";
import { ImageUpload } from "./ImageUpload";
import { booksApi } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface AddBookDialogProps {
  onBookAdded?: () => void;
}

interface BookSearchResult {
  googleBooksId: string;
  title: string;
  author: string;
  authors: string[];
  isbn?: string;
  isbn13?: string;
  pageCount?: number;
  publishedYear?: number;
  publisher?: string;
  description?: string;
  coverUrl?: string;
  genres?: string[];
}

export function AddBookDialog({ onBookAdded }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'search' | 'manual'>('search');

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");
  const [isbn, setIsbn] = useState("");

  const createBookMutation = useCreateBook();

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await booksApi.searchExternal(searchQuery);
        if (response.success) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Fehler",
          description: "Suche fehlgeschlagen",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description || "");
    // Fix HTTP to HTTPS for cover URLs
    const fixedCoverUrl = book.coverUrl ? book.coverUrl.replace('http://', 'https://') : "";
    setCoverUrl(fixedCoverUrl);
    setPageCount(book.pageCount?.toString() || "");
    setPublishedYear(book.publishedYear?.toString() || "");
    setPublisher(book.publisher || "");
    setLanguage(book.language || "");
    setIsbn(book.isbn || book.isbn13 || "");
    setMode('manual'); // Switch to manual mode to show filled form
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      toast({
        title: "Fehler",
        description: "Titel und Autor sind erforderlich",
        variant: "destructive",
      });
      return;
    }

    const parsedPageCount = pageCount.trim() ? parseInt(pageCount.trim()) : undefined;
    const parsedPublishedYear = publishedYear.trim() ? parseInt(publishedYear.trim()) : undefined;

    createBookMutation.mutate(
      {
        title: title.trim(),
        author: author.trim(),
        description: description.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        pageCount: parsedPageCount && parsedPageCount > 0 ? parsedPageCount : undefined,
        publishedYear: parsedPublishedYear && parsedPublishedYear > 0 ? parsedPublishedYear : undefined,
        publisher: publisher.trim() || undefined,
        language: language.trim() || undefined,
        status,
        isbn: isbn.trim() || undefined,
        genres: selectedBook?.genres || [],
        tags: [],
      },
      {
        onSuccess: () => {
          // Reset form
          resetForm();
          setOpen(false);
          onBookAdded?.();
        },
      }
    );
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedBook(null);
    setTitle("");
    setAuthor("");
    setDescription("");
    setCoverUrl("");
    setPageCount("");
    setPublishedYear("");
    setPublisher("");
    setLanguage("");
    setStatus("WANT_TO_READ");
    setIsbn("");
    setMode('search');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Buch hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Neues Buch hinzufügen</DialogTitle>
          <DialogDescription>
            {mode === 'search'
              ? 'Suche nach einem Buch, um Details automatisch auszufüllen'
              : 'Fülle die Details für dein Buch aus'
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'search' ? (
          <div className="space-y-4 py-4">
            {/* Search Bar */}
            <div className="space-y-2">
              <Label htmlFor="search">Buchtitel oder Autor suchen</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="z.B. Harry Potter, Stephen King..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl h-12 pl-10"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {searchResults.map((book) => (
                  <Card
                    key={book.googleBooksId}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSelectBook(book)}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-xl font-bold text-primary/30">{book.title[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {book.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {book.author}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {book.publishedYear && <span>📅 {book.publishedYear}</span>}
                          {book.pageCount && <span>📄 {book.pageCount} Seiten</span>}
                          {book.publisher && <span className="line-clamp-1">🏢 {book.publisher}</span>}
                        </div>
                      </div>
                      <Check className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Keine Bücher gefunden</p>
                <p className="text-sm">Versuche einen anderen Suchbegriff</p>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Gib einen Buchtitel oder Autor ein, um zu suchen</p>
              </div>
            )}

            {/* Manual Entry Option */}
            <div className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode('manual')}
                className="w-full rounded-xl h-12"
              >
                Buch nicht gefunden? Manuell hinzufügen
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Back Button */}
            {!selectedBook && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMode('search')}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Suche
              </Button>
            )}

            {selectedBook && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Ausgewählt: {selectedBook.title}
                </p>
              </div>
            )}

            {/* Manual Entry Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="Buchtitel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  placeholder="Autorenname"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="rounded-xl h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Worum geht es in dem Buch?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>

              <ImageUpload value={coverUrl} onChange={setCoverUrl} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pageCount">Seitenzahl</Label>
                  <Input
                    id="pageCount"
                    type="number"
                    placeholder="z.B. 320"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Erscheinungsjahr</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    placeholder="z.B. 2023"
                    value={publishedYear}
                    onChange={(e) => setPublishedYear(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Verlag</Label>
                  <Input
                    id="publisher"
                    placeholder="z.B. Loewe Verlag"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Input
                    id="language"
                    placeholder="z.B. de, en"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WANT_TO_READ">Wunschliste</SelectItem>
                    <SelectItem value="READING">Lese ich gerade</SelectItem>
                    <SelectItem value="FINISHED">Gelesen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl h-12"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-12"
                disabled={createBookMutation.isPending}
              >
                {createBookMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <BookOpen className="mr-2 h-5 w-5" />
                )}
                Buch hinzufügen
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
