import { useState } from "react";
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
import { Plus, Search, Loader2, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BookStatus } from "@/types/book";

interface AddBookDialogProps {
  onBookAdded?: () => void;
}

export function AddBookDialog({ onBookAdded }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [status, setStatus] = useState<BookStatus>("WANT_TO_READ");

  const handleIsbnSearch = async () => {
    if (!isbn.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte ISBN eingeben",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      setTitle("Beispielbuch via ISBN");
      setAuthor("Max Mustermann");
      setDescription("Eine faszinierende Geschichte über...");
      setPageCount("320");
      setPublishedYear("2023");
      setIsSearching(false);
      toast({
        title: "Buch gefunden",
        description: "Buchdetails wurden automatisch ausgefüllt",
      });
    }, 1500);
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

    // Here you would save the book
    toast({
      title: "Buch hinzugefügt",
      description: `"${title}" wurde zur Bibliothek hinzugefügt`,
    });

    // Reset form
    setIsbn("");
    setTitle("");
    setAuthor("");
    setDescription("");
    setPageCount("");
    setPublishedYear("");
    setStatus("WANT_TO_READ");
    setOpen(false);
    onBookAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Buch hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Neues Buch hinzufügen</DialogTitle>
          <DialogDescription>
            Füge ein Buch über ISBN-Suche oder manuell hinzu
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* ISBN Search */}
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN-Suche</Label>
            <div className="flex gap-2">
              <Input
                id="isbn"
                placeholder="z.B. 978-3-16-148410-0"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="rounded-xl h-11 flex-1"
              />
              <Button
                type="button"
                onClick={handleIsbnSearch}
                disabled={isSearching}
                className="rounded-xl px-6"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Buchdetails werden automatisch ausgefüllt
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <div className="h-px bg-border flex-1" />
              <span className="text-sm">oder manuell eingeben</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Manual Entry */}
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
            <Button type="submit" className="flex-1 rounded-xl h-12">
              <BookOpen className="mr-2 h-5 w-5" />
              Buch hinzufügen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
