import { CollapsibleWidget } from "./CollapsibleWidget";
import { TrendingUp, Target } from "lucide-react";

interface PredictiveReadingData {
  booksFinishedThisYear: number;
  projectedBooksThisYear: number;
  daysElapsed: number;
  daysRemaining: number;
}

interface PredictiveReadingWidgetProps {
  data: PredictiveReadingData;
  defaultCollapsed?: boolean;
}

export function PredictiveReadingWidget({ data, defaultCollapsed = false }: PredictiveReadingWidgetProps) {
  const currentYear = new Date().getFullYear();
  const progressPercent = (data.daysElapsed / (data.daysElapsed + data.daysRemaining)) * 100;

  return (
    <CollapsibleWidget
      title={`Jahresprognose ${currentYear}`}
      icon={<Target className="h-5 w-5" />}
      defaultCollapsed={defaultCollapsed}
      className="bg-gradient-to-br from-primary-light/10 to-accent-light/10"
    >
      <div className="space-y-6">
        {/* Main Prediction */}
        <div className="text-center bg-white/50 dark:bg-black/20 rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">Erwartete Bücher {currentYear}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-primary">
              {data.projectedBooksThisYear}
            </span>
            <span className="text-2xl text-muted-foreground">Bücher</span>
          </div>
          {data.projectedBooksThisYear > data.booksFinishedThisYear && (
            <p className="text-xs text-muted-foreground mt-2">
              Bei aktuellem Tempo
            </p>
          )}
        </div>

        {/* Current Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">Aktueller Fortschritt</span>
            <span className="text-sm font-semibold text-primary">
              {data.booksFinishedThisYear} Bücher
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {data.daysElapsed} von {data.daysElapsed + data.daysRemaining} Tagen
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{data.booksFinishedThisYear}</p>
            <p className="text-xs text-muted-foreground">Gelesen</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <Target className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">
              {Math.max(0, data.projectedBooksThisYear - data.booksFinishedThisYear)}
            </p>
            <p className="text-xs text-muted-foreground">Noch zu lesen</p>
          </div>
        </div>

        {data.booksFinishedThisYear === 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Beende dein erstes Buch, um eine Prognose zu erhalten
          </p>
        )}
      </div>
    </CollapsibleWidget>
  );
}
