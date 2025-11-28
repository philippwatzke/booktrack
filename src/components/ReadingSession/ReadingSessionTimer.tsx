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

interface ReadingSessionTimerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  currentPage?: number;
}

export function ReadingSessionTimer({
  open,
  onOpenChange,
  bookTitle,
  currentPage = 0,
}: ReadingSessionTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startPage, setStartPage] = useState(currentPage);
  const [endPage, setEndPage] = useState(currentPage);
  const [notes, setNotes] = useState("");

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
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    const pagesRead = endPage - startPage;
    toast({
      title: "Session gespeichert",
      description: `${formatTime(seconds)} gelesen, ${pagesRead} Seiten`,
    });
    setIsRunning(false);
    setSeconds(0);
    setNotes("");
    onOpenChange(false);
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
              disabled={seconds === 0}
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
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                className="rounded-xl h-11"
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endPage">Aktuelle Seite</Label>
              <Input
                id="endPage"
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(Number(e.target.value))}
                className="rounded-xl h-11"
              />
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
