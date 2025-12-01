import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, StopCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readingSessionsApi, booksApi } from "@/lib/api";

interface ReadingSessionTimerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookTitle: string;
  currentPage?: number;
  totalPages?: number;
}

export function ReadingSessionTimer({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  currentPage = 0,
  totalPages,
}: ReadingSessionTimerProps) {
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startPage, setStartPage] = useState(currentPage);
  const [endPage, setEndPage] = useState(currentPage);
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Create reading session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (data: {
      bookId: string;
      duration: number;
      pagesRead: number;
      startPage: number;
      endPage: number;
      notes?: string;
    }) => {
      const response = await readingSessionsApi.create(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create session');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingSessions'] });
    },
  });

  // Update book progress mutation
  const updateBookMutation = useMutation({
    mutationFn: async (data: { id: string; currentPage: number }) => {
      const response = await booksApi.update(data.id, { currentPage: data.currentPage });
      if (!response.success) {
        throw new Error(response.error || 'Failed to update book');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });

  useEffect(() => {
    if (open) {
      setStartPage(currentPage);
      setEndPage(currentPage);
    }
  }, [open, currentPage]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    if (!isRunning && !startTime) {
      setStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const handleStop = async () => {
    if (seconds === 0) {
      toast({
        title: "Keine Session",
        description: "Bitte starte zuerst die Session",
        variant: "destructive",
      });
      return;
    }

    const pagesRead = endPage - startPage;

    try {
      // Save reading session
      await createSessionMutation.mutateAsync({
        bookId,
        duration: seconds,
        pagesRead,
        startPage,
        endPage,
        notes: notes.trim() || undefined,
      });

      // Update book's current page
      if (endPage > currentPage) {
        await updateBookMutation.mutateAsync({
          id: bookId,
          currentPage: endPage,
        });
      }

      toast({
        title: "Session gespeichert",
        description: `${formatTime(seconds)} gelesen, ${pagesRead} Seiten`,
      });

      // Reset form
      setIsRunning(false);
      setSeconds(0);
      setNotes("");
      setStartTime(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Session konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (isRunning) {
      toast({
        title: "Session läuft noch",
        description: "Bitte beende die Session zuerst",
        variant: "destructive",
      });
      return;
    }

    // Reset on close if session wasn't saved
    setIsRunning(false);
    setSeconds(0);
    setNotes("");
    setStartTime(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Lese-Session</DialogTitle>
          <DialogDescription>{bookTitle}</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Timer Display */}
          <div className="bg-gradient-to-br from-primary-light/30 to-accent-light/30 rounded-2xl p-8 mb-6 text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-6xl font-bold text-foreground mb-2 font-mono">
              {formatTime(seconds)}
            </div>
            <div className="text-sm text-muted-foreground">
              {isRunning ? "Session läuft" : "Bereit zum Starten"}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleStartPause}
              className="flex-1 h-14 rounded-xl text-lg"
              variant={isRunning ? "outline" : "default"}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pausieren
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {seconds > 0 ? "Fortsetzen" : "Starten"}
                </>
              )}
            </Button>
            <Button
              onClick={handleStop}
              disabled={seconds === 0 || createSessionMutation.isPending || updateBookMutation.isPending}
              variant="outline"
              className="h-14 px-6 rounded-xl"
            >
              <StopCircle className="mr-2 h-5 w-5" />
              Beenden
            </Button>
          </div>

          {/* Page Input */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="startPage">Startseite</Label>
              <Input
                id="startPage"
                type="number"
                min="0"
                max={totalPages || undefined}
                value={startPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!totalPages || val <= totalPages) {
                    setStartPage(val);
                  }
                }}
                className="rounded-xl h-11"
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endPage">Aktuelle Seite</Label>
              <Input
                id="endPage"
                type="number"
                min="0"
                max={totalPages || undefined}
                value={endPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!totalPages || val <= totalPages) {
                    setEndPage(val);
                  }
                }}
                className="rounded-xl h-11"
              />
              {totalPages && <p className="text-xs text-muted-foreground">Max: {totalPages} Seiten</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notizen (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Gedanken, Eindrücke, wichtige Punkte..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="text-sm text-muted-foreground text-center w-full">
            {endPage - startPage > 0 && (
              <span>{endPage - startPage} Seiten gelesen</span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
