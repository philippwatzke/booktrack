import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SeriesProgress {
  total: number;
  collected: number;
  wishlist: number;
  missing: number;
  percentage: number;
}

interface SeriesTrackerProps {
  collectionName: string;
  collectionType: string;
  progress: SeriesProgress;
  isComplete?: boolean;
}

export function SeriesTracker({
  collectionName,
  collectionType,
  progress,
  isComplete = false,
}: SeriesTrackerProps) {
  const isSeries = collectionType === "SERIES";

  return (
    <Card className="p-6 rounded-2xl border-border bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {isSeries ? "Serien-Fortschritt" : "Sammel-Fortschritt"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {collectionName}
          </p>
        </div>

        {isComplete && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6 fill-green-500" />
            <span className="font-semibold text-sm">Komplett!</span>
          </div>
        )}
      </div>

      {/* Main Progress */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {isSeries ? "Bücher in Reihe" : "Sammlung"}
            </span>
            <span className="font-bold text-primary text-xl">
              {progress.collected} / {progress.total}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-3 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {progress.percentage}% abgeschlossen
            </span>
            {progress.missing > 0 && (
              <span className="text-xs text-red-600 font-medium">
                {progress.missing} {progress.missing === 1 ? "fehlt noch" : "fehlen noch"}
              </span>
            )}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-600">
                {progress.collected}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Gesammelt</div>
          </div>

          <div className="text-center border-l border-r border-border">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-2xl font-bold text-yellow-600">
                {progress.wishlist}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Wunschliste</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-2xl font-bold text-red-600">
                {progress.missing}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Fehlend</div>
          </div>
        </div>

        {/* Series specific info */}
        {isSeries && progress.total > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {progress.percentage === 100 && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Reihe komplett!
                </Badge>
              )}
              {progress.percentage >= 75 && progress.percentage < 100 && (
                <Badge variant="default" className="bg-blue-600">
                  Fast geschafft!
                </Badge>
              )}
              {progress.percentage >= 50 && progress.percentage < 75 && (
                <Badge variant="secondary">
                  Über die Hälfte!
                </Badge>
              )}
              {progress.collected > 0 && (
                <Badge variant="outline">
                  {progress.collected} {progress.collected === 1 ? "Band" : "Bände"}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
