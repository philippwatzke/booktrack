import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Quote as QuoteIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  text: string;
  page?: number;
  createdAt: string;
}

interface QuoteEditorProps {
  bookId: string;
}

export function QuoteEditor({ bookId }: QuoteEditorProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [text, setText] = useState("");
  const [page, setPage] = useState("");

  const handleSave = () => {
    if (!text.trim()) {
      toast({
        title: "Fehler",
        description: "Zitat darf nicht leer sein",
        variant: "destructive",
      });
      return;
    }

    if (editingQuote) {
      setQuotes(
        quotes.map((quote) =>
          quote.id === editingQuote.id
            ? {
                ...quote,
                text,
                page: page ? Number(page) : undefined,
              }
            : quote
        )
      );
      toast({ title: "Zitat aktualisiert" });
    } else {
      const newQuote: Quote = {
        id: Date.now().toString(),
        text,
        page: page ? Number(page) : undefined,
        createdAt: new Date().toISOString(),
      };
      setQuotes([newQuote, ...quotes]);
      toast({ title: "Zitat hinzugefügt" });
    }

    handleClose();
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setText(quote.text);
    setPage(quote.page?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuotes(quotes.filter((quote) => quote.id !== id));
    toast({ title: "Zitat gelöscht" });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingQuote(null);
    setText("");
    setPage("");
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl h-12 shadow-md">
            <Plus className="mr-2 h-5 w-5" />
            Neues Zitat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuote ? "Zitat bearbeiten" : "Neues Zitat"}
            </DialogTitle>
            <DialogDescription>
              Speichere inspirierende Passagen aus dem Buch
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page">Seite (optional)</Label>
              <Input
                id="page"
                type="number"
                placeholder="z.B. 42"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Zitat</Label>
              <Textarea
                id="text"
                placeholder="Füge hier das Zitat ein..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="rounded-xl min-h-[200px] resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              Abbrechen
            </Button>
            <Button onClick={handleSave} className="flex-1 rounded-xl">
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {quotes.length === 0 ? (
        <Card className="p-12 rounded-2xl border-border border-dashed text-center">
          <QuoteIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Noch keine Zitate gespeichert.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Klicke auf "Neues Zitat", um loszulegen.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="p-6 rounded-2xl border-border hover:shadow-md transition-all bg-gradient-to-br from-primary-light/10 to-accent-light/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {quote.page && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Seite {quote.page}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(quote.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(quote)}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quote.id)}
                    className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <QuoteIcon className="absolute -left-2 -top-2 h-8 w-8 text-primary/20" />
                <blockquote className="pl-6 text-foreground leading-relaxed italic text-lg">
                  "{quote.text}"
                </blockquote>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
