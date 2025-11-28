import { Card } from "@/components/ui/card";
import { Quote as QuoteIcon, BookOpen } from "lucide-react";

export default function Quotes() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Zitate & Notizen</h1>
          <p className="text-muted-foreground">
            Sammle deine Lieblingsmomente aus deinen Büchern
          </p>
        </div>

        {/* Empty State */}
        <Card className="p-12 rounded-2xl border-border text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <QuoteIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Noch keine Zitate gespeichert
          </h3>
          <p className="text-muted-foreground mb-6">
            Markiere inspirierende Passagen beim Lesen und speichere sie hier
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Öffne ein Buch, um Zitate hinzuzufügen</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
