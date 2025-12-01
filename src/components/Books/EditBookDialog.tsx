import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Book, BookStatus } from "@/types/book";
import { useUpdateBook } from "@/hooks/useBooks";
import { ImageUpload } from "./ImageUpload";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated?: () => void;
}

export function EditBookDialog({ book, open, onOpenChange, onBookUpdated }: EditBookDialogProps) {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [publisher, setPublisher] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");
  const [priority, setPriority] = useState("");
  const [rating, setRating] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const updateBookMutation = useUpdateBook();

  // Initialize form with book data
  useEffect(() => {
    if (book && open) {
      setIsbn(book.isbn || "");
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description || "");
      setCoverUrl(book.coverUrl || "");
      setPublisher(book.publisher || "");
      setPageCount(book.pageCount?.toString() || "");
      setPublishedYear(book.publishedYear?.toString() || "");
      setLanguage(book.language || "");
      setStatus(book.status);
      setPriority(book.priority?.toString() || "");
      setRating(book.rating?.toString() || "");
      setCurrentPage(book.currentPage?.toString() || "");
      setGenres(book.genres || []);
      setTags(book.tags || []);
    }
  }, [book, open]);

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
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

    updateBookMutation.mutate(
      {
        id: book.id,
        data: {
          title: title.trim(),
          author: author.trim(),
          isbn: isbn.trim() || undefined,
          description: description.trim() || undefined,
          coverUrl: coverUrl.trim() || undefined,
          publisher: publisher.trim() || undefined,
          pageCount: pageCount ? parseInt(pageCount) : book.pageCount,
          publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
          language: language.trim() || undefined,
          status,
          priority: priority ? parseInt(priority) : undefined,
          rating: rating ? parseInt(rating) : undefined,
          currentPage: currentPage ? parseInt(currentPage) : undefined,
          genres,
          tags,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onBookUpdated?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Buch bearbeiten</DialogTitle>
          <DialogDescription>
            Aktualisiere die Informationen zu deinem Buch
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Info */}
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
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="z.B. 978-3-16-148410-0"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="rounded-xl h-11"
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
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Verlag</Label>
              <Input
                id="publisher"
                placeholder="Verlagsname"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Sprache</Label>
              <Input
                id="language"
                placeholder="z.B. Deutsch"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

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

          {/* Status & Progress */}
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priorität (1-5)</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="5"
                placeholder="z.B. 3"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>

            {status === "READING" && (
              <div className="space-y-2">
                <Label htmlFor="currentPage">Aktuelle Seite</Label>
                <Input
                  id="currentPage"
                  type="number"
                  min="0"
                  max={pageCount || undefined}
                  placeholder="z.B. 142"
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const maxPages = parseInt(pageCount) || Infinity;
                    if (isNaN(val) || val <= maxPages) {
                      setCurrentPage(e.target.value);
                    }
                  }}
                  className="rounded-xl h-11"
                />
                {pageCount && <p className="text-xs text-muted-foreground">Max: {pageCount} Seiten</p>}
              </div>
            )}

            {status === "FINISHED" && (
              <div className="space-y-2">
                <Label htmlFor="rating">Bewertung (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="z.B. 4"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Genre hinzufügen"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                className="rounded-xl h-11"
              />
              <Button
                type="button"
                onClick={handleAddGenre}
                className="rounded-xl"
              >
                Hinzufügen
              </Button>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="default"
                    className="rounded-full px-3 py-1 cursor-pointer"
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    {genre}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Tag hinzufügen"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="rounded-xl h-11"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl"
              >
                Hinzufügen
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-3 py-1 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl h-12"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-12"
              disabled={updateBookMutation.isPending}
            >
              {updateBookMutation.isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <BookOpen className="mr-2 h-5 w-5" />
              )}
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
