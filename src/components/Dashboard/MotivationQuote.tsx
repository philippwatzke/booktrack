import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

const MOTIVATION_QUOTES = [
  {
    text: "Ein Buch ist ein Garten, den man in der Tasche trägt.",
    author: "Arabisches Sprichwort",
  },
  {
    text: "Lesen ist für den Geist, was Gymnastik für den Körper ist.",
    author: "Joseph Addison",
  },
  {
    text: "Je mehr du liest, desto mehr Dinge wirst du wissen. Je mehr du lernst, desto mehr Orte wirst du besuchen.",
    author: "Dr. Seuss",
  },
  {
    text: "Wer zu lesen versteht, besitzt den Schlüssel zu großen Taten, zu unerträumten Möglichkeiten.",
    author: "Aldous Huxley",
  },
  {
    text: "Bücher sind die stillsten und beständigsten Freunde; sie sind die zugänglichsten und weisesten Ratgeber.",
    author: "Charles William Eliot",
  },
  {
    text: "Es gibt mehr Schätze in Büchern als in der gesamten Piratenbeute der Schatzinsel.",
    author: "Walt Disney",
  },
  {
    text: "Ein Raum ohne Bücher ist wie ein Körper ohne Seele.",
    author: "Marcus Tullius Cicero",
  },
  {
    text: "Lesen ist Denken mit fremdem Gehirn.",
    author: "Jorge Luis Borges",
  },
  {
    text: "Heute einen Leser, morgen einen Anführer.",
    author: "Margaret Fuller",
  },
  {
    text: "Bücher sind die Flugzeuge, Züge und Straßen ins Land der Weisheit.",
    author: "Bertrand Russell",
  },
  {
    text: "Nur weil du ein Buch gelesen hast, bedeutet das nicht, dass du deine Zeit verschwendet hast.",
    author: "Unknown",
  },
  {
    text: "Lesen ist ein Gespräch mit den edelsten Menschen vergangener Zeiten.",
    author: "René Descartes",
  },
  {
    text: "Ein gutes Buch ist ein Ereignis in meinem Leben.",
    author: "Stendhal",
  },
  {
    text: "Bücher lesen heißt wandern gehen in ferne Welten, aus den Stuben über die Sterne.",
    author: "Jean Paul",
  },
  {
    text: "Die Lektüre ist eine Quelle des Glücks.",
    author: "Victor Hugo",
  },
  {
    text: "Lesen macht vielseitig, Verhandeln geistesgegenwärtig und Schreiben genau.",
    author: "Francis Bacon",
  },
  {
    text: "Ein Buch muss die Axt sein für das gefrorene Meer in uns.",
    author: "Franz Kafka",
  },
  {
    text: "Überall wo man Bücher verbrennt, verbrennt man am Ende auch Menschen.",
    author: "Heinrich Heine",
  },
  {
    text: "Gute Freunde, gute Bücher und ein schläfriges Gewissen: Das ist das ideale Leben.",
    author: "Mark Twain",
  },
  {
    text: "Lesen ist für mich die angenehmste Form des Zeitvertreibs.",
    author: "Jane Austen",
  },
];

export function MotivationQuote() {
  const [quoteIndex, setQuoteIndex] = useState(
    Math.floor(Math.random() * MOTIVATION_QUOTES.length)
  );

  const currentQuote = useMemo(
    () => MOTIVATION_QUOTES[quoteIndex],
    [quoteIndex]
  );

  const handleRefresh = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    } while (newIndex === quoteIndex && MOTIVATION_QUOTES.length > 1);
    setQuoteIndex(newIndex);
  };

  return (
    <Card className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-accent/5 to-primary/5 break-inside-avoid">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Motivation</h3>
            <p className="text-xs text-muted-foreground">Lass dich inspirieren</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-8 w-8 p-0 rounded-lg"
          title="Neues Zitat"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <blockquote className="relative">
        <div className="text-6xl text-primary/20 leading-none mb-2">"</div>
        <p className="text-foreground font-medium leading-relaxed mb-3 -mt-8 pl-8">
          {currentQuote.text}
        </p>
        <footer className="text-sm text-muted-foreground pl-8">
          <cite className="not-italic font-semibold">
            — {currentQuote.author}
          </cite>
        </footer>
      </blockquote>
    </Card>
  );
}
