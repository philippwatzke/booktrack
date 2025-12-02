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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePreferences, useUpdatePreferences } from "@/hooks/useGoals";

export interface WidgetSettings {
  recentActivity: { enabled: boolean; collapsed: boolean };
  readingPatterns: { enabled: boolean; collapsed: boolean };
  predictiveReading: { enabled: boolean; collapsed: boolean };
  monthlyReport: { enabled: boolean; collapsed: boolean };
  streakCalendar: { enabled: boolean; collapsed: boolean };
  streakMilestones: { enabled: boolean; collapsed: boolean };
  randomQuote: { enabled: boolean; collapsed: boolean };
  motivationQuote: { enabled: boolean; collapsed: boolean };
  order?: string[]; // Widget order for drag-and-drop
}

const DEFAULT_WIDGET_ORDER = [
  'streakBadge',
  'goalsWidget',
  'streakCalendar',
  'streakMilestones',
  'recentActivity',
  'readingPatterns',
  'predictiveReading',
  'monthlyReport',
  'randomQuote',
  'motivationQuote'
];

const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  recentActivity: { enabled: true, collapsed: false },
  readingPatterns: { enabled: true, collapsed: false },
  predictiveReading: { enabled: true, collapsed: false },
  monthlyReport: { enabled: true, collapsed: false },
  streakCalendar: { enabled: true, collapsed: false },
  streakMilestones: { enabled: true, collapsed: false },
  randomQuote: { enabled: true, collapsed: false },
  motivationQuote: { enabled: true, collapsed: false },
  order: DEFAULT_WIDGET_ORDER,
};

const WIDGET_LABELS: Record<keyof WidgetSettings, string> = {
  recentActivity: "Letzte Aktivität",
  readingPatterns: "Lesemuster",
  predictiveReading: "Jahresprognose",
  monthlyReport: "Monatsübersicht",
  streakCalendar: "Streak-Kalender",
  streakMilestones: "Streak-Meilensteine",
  randomQuote: "Zufälliges Zitat",
  motivationQuote: "Motivations-Zitat",
};

export function DashboardSettings() {
  const [open, setOpen] = useState(false);
  const { data: preferences } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>(DEFAULT_WIDGET_SETTINGS);

  useEffect(() => {
    if (preferences?.dashboardWidgets) {
      try {
        const parsed = JSON.parse(preferences.dashboardWidgets);
        setWidgetSettings({ ...DEFAULT_WIDGET_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse dashboard widgets:", e);
      }
    }
  }, [preferences]);

  const handleToggle = (widgetKey: keyof WidgetSettings) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widgetKey]: {
        ...prev[widgetKey],
        enabled: !prev[widgetKey].enabled,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync({
        dashboardWidgets: JSON.stringify(widgetSettings),
      });
      toast({
        title: "Einstellungen gespeichert",
        description: "Deine Dashboard-Einstellungen wurden gespeichert",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Settings className="h-4 w-4" />
          Dashboard anpassen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dashboard-Einstellungen</DialogTitle>
          <DialogDescription>
            Wähle, welche Widgets auf deinem Dashboard angezeigt werden sollen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {(Object.keys(widgetSettings) as Array<keyof WidgetSettings>).map((key) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30">
              <Label htmlFor={key} className="cursor-pointer flex-1">
                {WIDGET_LABELS[key]}
              </Label>
              <Switch
                id={key}
                checked={widgetSettings[key].enabled}
                onCheckedChange={() => handleToggle(key)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePreferences.isPending}
            className="flex-1 rounded-xl"
          >
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper hook to get widget settings
export function useWidgetSettings(): WidgetSettings {
  const { data: preferences } = usePreferences();

  if (preferences?.dashboardWidgets) {
    try {
      const parsed = JSON.parse(preferences.dashboardWidgets);
      return { ...DEFAULT_WIDGET_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_WIDGET_SETTINGS;
    }
  }

  return DEFAULT_WIDGET_SETTINGS;
}
