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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, StopCircle, Clock, Target, Maximize2, Minimize2, Home, Coffee, Train, Plane, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readingSessionsApi, booksApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ReadingSessionTimerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  bookTitle: string;
  currentPage?: number;
  totalPages?: number;
}

type TimerMode = "stopwatch" | "countdown";
type Location = "HOME" | "COMMUTE" | "CAFE" | "TRAVEL" | "OTHER";
type SessionStep = "setup" | "running" | "reflection";

export function ReadingSessionTimer({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  currentPage = 0,
  totalPages,
}: ReadingSessionTimerProps) {
  const queryClient = useQueryClient();

  // Session state
  const [step, setStep] = useState<SessionStep>("setup");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer settings
  const [timerMode, setTimerMode] = useState<TimerMode>("stopwatch");
  const [targetDuration, setTargetDuration] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");

  // Session data
  const [startPage, setStartPage] = useState(currentPage);
  const [endPage, setEndPage] = useState(currentPage);
  const [targetPages, setTargetPages] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState<Location | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Reflection data
  const [quality, setQuality] = useState<number>(3);
  const [reflection, setReflection] = useState("");
  const [quote, setQuote] = useState("");

  // Auto-detect time of day
  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "MORNING";
    if (hour >= 12 && hour < 17) return "AFTERNOON";
    if (hour >= 17 && hour < 22) return "EVENING";
    return "NIGHT";
  };

  // Calculate reading speed (pages per hour)
  const getReadingSpeed = (): number => {
    if (seconds === 0) return 0;
    const pagesRead = endPage - startPage;
    const hours = seconds / 3600;
    return Math.round(pagesRead / hours);
  };

  // Calculate estimated time remaining (for page goal)
  const getEstimatedTimeRemaining = (): number | null => {
    if (!targetPages || seconds === 0) return null;
    const pagesRead = endPage - startPage;
    const pagesRemaining = targetPages - pagesRead;
    if (pagesRemaining <= 0) return 0;

    const speed = getReadingSpeed();
    if (speed === 0) return null;

    return Math.round((pagesRemaining / speed) * 60); // in minutes
  };

  // Progress percentage (for countdown or page goal)
  const getProgress = (): number => {
    if (timerMode === "countdown" && targetDuration) {
      return Math.min((seconds / targetDuration) * 100, 100);
    }
    if (targetPages) {
      const pagesRead = endPage - startPage;
      return Math.min((pagesRead / targetPages) * 100, 100);
    }
    return 0;
  };

  // Create reading session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (data: {
      bookId: string;
      duration: number;
      pagesRead: number;
      startPage: number;
      endPage: number;
      notes?: string;
      location?: string;
      timeOfDay?: string;
      targetDuration?: number;
      targetPages?: number;
      quality?: number;
      reflection?: string;
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setStep("setup");
      // Set start page to current page (or 0 if no page set)
      const initialPage = currentPage || 0;
      setStartPage(initialPage);
      setEndPage(initialPage);
      setIsRunning(false);
      setIsPaused(false);
      setSeconds(0);
      setTargetDuration(null);
      setTargetPages(null);
      setNotes("");
      setLocation(null);
      setQuality(3);
      setReflection("");
      setQuote("");
      setIsFullscreen(false);
    }
  }, [open, currentPage]);

  // Timer countdown/stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((s) => {
          // Countdown mode
          if (timerMode === "countdown" && targetDuration) {
            const newValue = s + 1;
            if (newValue >= targetDuration) {
              setIsRunning(false);
              // Play completion sound
              const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGJ0fPTgjMGHm7A7+OZSA0OVKzn77BgGAg+j9bxxHQoBS2D0PDYjTwICGS+7+OZRQ4QW7Dq8bJfGAo5lNfz0HwqBSh+zPDglEUKE1m16vCwXhoJP5XZ8st7KwYqgNDx4ZhHChRbsuv4s2MaC0GU2vPOeywGKoHQ8d2PRQ0OWbPp8bJgHAk5lNrzz34rBSqBz/DXjT0ICmi+7eOURA0QWq3o8bJhGw0+l9z0y3srBSuCzfDahDoIFWe+7eSXRg0RWK/p8LBgGws+ltv0zHwrBSl+y+/dkEYLEVmx6e+vYBoLP5bb88x8KgYpfs/v3I8/CQ5XsOjvsV4aDECX2fPOeSsFKHzL7dmNOwgQZ77t45dGDRFYruns/V");
              audio.volume = 0.3;
              audio.play().catch(() => {});
              toast({
                title: "Zeit abgelaufen!",
                description: "Dein Leseziel ist erreicht",
              });
              return targetDuration;
            }
            return newValue;
          }
          // Stopwatch mode
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timerMode, targetDuration]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeRemaining = () => {
    if (timerMode !== "countdown" || !targetDuration) return null;
    const remaining = Math.max(0, targetDuration - seconds);
    return formatTime(remaining);
  };

  const handleStart = () => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setStep("running");
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    if (seconds === 0) {
      toast({
        title: "Keine Session",
        description: "Bitte starte zuerst die Session",
        variant: "destructive",
      });
      return;
    }
    setIsRunning(false);
    setStep("reflection");
  };

  const handleSaveSession = async () => {
    const pagesRead = endPage - startPage;

    try {
      // Save reading session
      await createSessionMutation.mutateAsync({
        bookId,
        duration: seconds,
        pagesRead,
        startPage,
        endPage,
        notes: reflection.trim() || undefined, // Save reflection in notes field
        location: location || undefined,
        timeOfDay: getTimeOfDay(),
        targetDuration: targetDuration || undefined,
        targetPages: targetPages || undefined,
        quality,
        reflection: reflection.trim() || undefined,
      });

      // Save quote if provided
      if (quote.trim()) {
        await fetch('/api/quotes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            bookId,
            text: quote.trim(),
            page: endPage,
          }),
        });
      }

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
    if (isRunning && !isPaused) {
      toast({
        title: "Session läuft noch",
        description: "Bitte pausiere oder beende die Session zuerst",
        variant: "destructive",
      });
      return;
    }
    onOpenChange(false);
  };

  const setPresetDuration = (minutes: number) => {
    setTargetDuration(minutes * 60);
    setTimerMode("countdown");
  };

  const setCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      setTargetDuration(minutes * 60);
      setTimerMode("countdown");
    }
  };

  const locationIcons = {
    HOME: Home,
    COMMUTE: Train,
    CAFE: Coffee,
    TRAVEL: Plane,
    OTHER: MapPin,
  };

  // Circular progress ring
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg className="transform -rotate-90" width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "rounded-3xl transition-all",
          isFullscreen ? "sm:max-w-full h-screen" : "sm:max-w-[600px]"
        )}
      >
        {/* Setup Step */}
        {step === "setup" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Lese-Session starten</DialogTitle>
              <DialogDescription>{bookTitle}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Timer Mode Selection */}
              <Tabs value={timerMode} onValueChange={(v) => setTimerMode(v as TimerMode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                  <TabsTrigger value="countdown">Countdown</TabsTrigger>
                </TabsList>

                <TabsContent value="countdown" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={targetDuration === 15 * 60 ? "default" : "outline"}
                      onClick={() => setPresetDuration(15)}
                      className="rounded-xl"
                    >
                      15 min
                    </Button>
                    <Button
                      variant={targetDuration === 30 * 60 ? "default" : "outline"}
                      onClick={() => setPresetDuration(30)}
                      className="rounded-xl"
                    >
                      30 min
                    </Button>
                    <Button
                      variant={targetDuration === 60 * 60 ? "default" : "outline"}
                      onClick={() => setPresetDuration(60)}
                      className="rounded-xl"
                    >
                      60 min
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Custom (Minuten)"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button onClick={setCustomDuration} variant="outline" className="rounded-xl">
                      Set
                    </Button>
                  </div>
                  {targetDuration && (
                    <p className="text-sm text-muted-foreground text-center">
                      Ziel: {Math.round(targetDuration / 60)} Minuten
                    </p>
                  )}
                </TabsContent>
              </Tabs>

              {/* Page Goal */}
              <div className="space-y-2">
                <Label htmlFor="targetPages" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Seitenziel (optional)
                </Label>
                <Input
                  id="targetPages"
                  type="number"
                  placeholder="z.B. 50 Seiten"
                  value={targetPages || ""}
                  onChange={(e) => setTargetPages(e.target.value ? parseInt(e.target.value) : null)}
                  className="rounded-xl"
                />
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <Label>Wo liest du?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(locationIcons) as Location[]).map((loc) => {
                    const Icon = locationIcons[loc];
                    return (
                      <Button
                        key={loc}
                        variant={location === loc ? "default" : "outline"}
                        onClick={() => setLocation(loc)}
                        className="rounded-xl flex-col h-auto py-3"
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-xs">{loc === "HOME" ? "Zuhause" : loc === "COMMUTE" ? "Unterwegs" : loc === "CAFE" ? "Café" : loc === "TRAVEL" ? "Reise" : "Sonstiges"}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Start Page (read-only info) */}
              <div className="bg-muted/30 rounded-2xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Startseite</div>
                <div className="text-2xl font-bold">Seite {startPage}</div>
                {totalPages && (
                  <div className="text-xs text-muted-foreground mt-1">
                    von {totalPages} Seiten
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleStart} className="w-full rounded-xl h-12">
                <Play className="mr-2 h-5 w-5" />
                Session starten
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Running Step */}
        {step === "running" && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl">{timerMode === "countdown" ? "Countdown" : "Lese-Session"}</DialogTitle>
                  <DialogDescription>{bookTitle}</DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="rounded-xl"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
              </div>
            </DialogHeader>

            <div className="py-8 space-y-6">
              {/* Circular Progress Timer */}
              <div className="relative flex items-center justify-center">
                {(timerMode === "countdown" && targetDuration) || targetPages ? (
                  <CircularProgress percentage={getProgress()} />
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <div className="text-5xl font-bold font-mono">
                    {timerMode === "countdown" ? formatTimeRemaining() : formatTime(seconds)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {isPaused ? "Pausiert" : "Läuft"}
                  </div>
                </div>
              </div>

              {/* Live Statistics */}
              <div className="grid grid-cols-3 gap-4 bg-muted/30 rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{endPage - startPage}</div>
                  <div className="text-xs text-muted-foreground">Seiten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{getReadingSpeed()}</div>
                  <div className="text-xs text-muted-foreground">S/h</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {targetPages ? `${Math.round(getProgress())}%` : "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">Fortschritt</div>
                </div>
              </div>

              {/* Page Update */}
              <div className="space-y-2">
                <Label htmlFor="currentPageUpdate">Aktuelle Seite</Label>
                <Input
                  id="currentPageUpdate"
                  type="number"
                  min={startPage}
                  max={totalPages || undefined}
                  value={endPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    // Don't allow going back before start page
                    if (val >= startPage && (!totalPages || val <= totalPages)) {
                      setEndPage(val);
                    }
                  }}
                  className="rounded-xl h-12 text-center text-xl font-semibold"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Startseite: {startPage} {totalPages && `• Max: ${totalPages}`}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="flex-1 h-14 rounded-xl text-lg"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pausieren
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    className="flex-1 h-14 rounded-xl text-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Fortsetzen
                  </Button>
                )}
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  className="h-14 px-8 rounded-xl"
                >
                  <StopCircle className="mr-2 h-5 w-5" />
                  Beenden
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Reflection Step */}
        {step === "reflection" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Wie war deine Session?</DialogTitle>
              <DialogDescription>Nimm dir einen Moment zum Reflektieren</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Session Summary */}
              <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                <div className="text-center">
                  <div className="text-4xl font-bold">{formatTime(seconds)}</div>
                  <div className="text-sm text-muted-foreground">Lesezeit</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{endPage - startPage}</div>
                    <div className="text-xs text-muted-foreground">Seiten gelesen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{getReadingSpeed()}</div>
                    <div className="text-xs text-muted-foreground">Seiten/Stunde</div>
                  </div>
                </div>
              </div>

              {/* Quality Rating */}
              <div className="space-y-2">
                <Label>Wie fokussiert warst du?</Label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={quality === rating ? "default" : "outline"}
                      onClick={() => setQuality(rating)}
                      className="rounded-full w-12 h-12"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {quality === 1 && "Sehr abgelenkt"}
                  {quality === 2 && "Etwas abgelenkt"}
                  {quality === 3 && "Normal"}
                  {quality === 4 && "Gut fokussiert"}
                  {quality === 5 && "Sehr fokussiert"}
                </p>
              </div>

              {/* Reflection Notes */}
              <div className="space-y-2">
                <Label htmlFor="reflection">Session-Notizen</Label>
                <Textarea
                  id="reflection"
                  placeholder="Was hast du gelesen? Interessante Gedanken? Wichtige Punkte?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="rounded-xl min-h-[120px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Diese Notizen werden der Session zugeordnet und können später im Buch angesehen werden
                </p>
              </div>

              {/* Quote */}
              <div className="space-y-2">
                <Label htmlFor="quote">Lieblingszitat (optional)</Label>
                <Textarea
                  id="quote"
                  placeholder="Ein Zitat, das dich berührt hat..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="rounded-xl min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Wird als separates Zitat zu deiner Sammlung hinzugefügt (Seite {endPage})
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleSaveSession}
                disabled={createSessionMutation.isPending || updateBookMutation.isPending}
                className="w-full rounded-xl h-12"
              >
                Session speichern
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
