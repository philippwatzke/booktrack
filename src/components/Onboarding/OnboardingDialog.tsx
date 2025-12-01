import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePreferences, useCreateGoal } from "@/hooks/useGoals";
import { BookOpen, Target, Clock, Sparkles } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [annualBookGoal, setAnnualBookGoal] = useState<number>(12);
  const [dailyReadingMins, setDailyReadingMins] = useState<number>(30);

  const updatePreferences = useUpdatePreferences();
  const createGoal = useCreateGoal();

  const handleComplete = async () => {
    try {
      // Update preferences
      await updatePreferences.mutateAsync({
        annualBookGoal,
        dailyReadingGoalMins: dailyReadingMins,
        hasCompletedOnboarding: true,
      });

      // Create annual goal
      const currentYear = new Date().getFullYear();
      await createGoal.mutateAsync({
        type: 'ANNUAL',
        target: annualBookGoal,
        metric: 'BOOKS',
        deadline: new Date(`${currentYear}-12-31`),
      });

      onComplete();
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">
                Willkommen bei BookTrack!
              </DialogTitle>
              <p className="text-center text-muted-foreground mt-2">
                Lass uns deine Lese-Reise personalisieren
              </p>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="annualGoal" className="text-base">
                  <Target className="inline h-4 w-4 mr-2" />
                  Wie viele Bücher möchtest du 2025 lesen?
                </Label>
                <Input
                  id="annualGoal"
                  type="number"
                  value={annualBookGoal}
                  onChange={(e) => setAnnualBookGoal(parseInt(e.target.value) || 0)}
                  min={1}
                  max={1000}
                  className="text-lg text-center"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Das sind ca. {Math.round(annualBookGoal / 12)} Buch/Bücher pro Monat
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyTime" className="text-base">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Wie viel Zeit möchtest du täglich lesen?
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 60, 90].map((mins) => (
                    <Button
                      key={mins}
                      variant={dailyReadingMins === mins ? "default" : "outline"}
                      onClick={() => setDailyReadingMins(mins)}
                      className="h-auto py-3"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{mins}</div>
                        <div className="text-xs">Min.</div>
                      </div>
                    </Button>
                  ))}
                </div>
                <Input
                  id="dailyTime"
                  type="number"
                  value={dailyReadingMins}
                  onChange={(e) => setDailyReadingMins(parseInt(e.target.value) || 0)}
                  min={5}
                  max={480}
                  placeholder="Eigene Zeit (Minuten)"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={handleComplete} size="lg" className="gap-2">
                Los geht's!
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
