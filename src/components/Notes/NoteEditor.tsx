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
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "@/hooks/useNotes";
import { Note } from "@/types/book";

interface NoteEditorProps {
  bookId: string;
  totalPages?: number;
}

export function NoteEditor({ bookId, totalPages }: NoteEditorProps) {
  const { data: notes = [], isLoading } = useNotes(bookId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [page, setPage] = useState("");

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Fehler",
        description: "Notiz darf nicht leer sein",
        variant: "destructive",
      });
      return;
    }

    if (editingNote) {
      await updateNote.mutateAsync({
        id: editingNote.id,
        data: {
          content,
          page: page ? Number(page) : undefined,
        },
      });
    } else {
      await createNote.mutateAsync({
        bookId,
        content,
        page: page ? Number(page) : undefined,
      });
    }

    handleClose();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setContent(note.content);
    setPage(note.page?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNote.mutateAsync(id);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    setContent("");
    setPage("");
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full rounded-xl h-12 shadow-md">
            <Plus className="mr-2 h-5 w-5" />
            Neue Notiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Notiz bearbeiten" : "Neue Notiz"}
            </DialogTitle>
            <DialogDescription>
              Füge deine Gedanken und Erkenntnisse hinzu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page">Seite (optional)</Label>
              <Input
                id="page"
                type="number"
                min="1"
                max={totalPages || undefined}
                placeholder="z.B. 42"
                value={page}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!totalPages || val <= totalPages || e.target.value === '') {
                    setPage(e.target.value);
                  }
                }}
                className="rounded-xl h-11"
              />
              {totalPages && <p className="text-xs text-muted-foreground">Max: {totalPages} Seiten</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Notiz</Label>
              <Textarea
                id="content"
                placeholder="Schreibe deine Notiz hier..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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

      {notes.length === 0 ? (
        <Card className="p-12 rounded-2xl border-border border-dashed text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Noch keine Notizen vorhanden.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Klicke auf "Neue Notiz", um loszulegen.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="p-5 rounded-2xl border-border hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {note.page && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Seite {note.page}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString("de-DE", {
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
                    onClick={() => handleEdit(note)}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
