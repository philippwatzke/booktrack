import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  StickyNote,
  Search,
  Plus,
  MoreHorizontal,
  BookOpen,
  Calendar,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useAllNotes } from "@/hooks/useNotes";
import { useBooks } from "@/hooks/useBooks";

export default function Notes() {
  const { data: notes = [], isLoading } = useAllNotes();
  const { data: books = [] } = useBooks({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a map of bookId to book for quick lookup
  const bookMap = new Map(books.map(book => [book.id, book]));

  // Define colors for notes (cycling through)
  const noteColors = [
    "bg-primary/10 border-primary/30",
    "bg-amber-warm/10 border-amber-warm/30",
    "bg-forest-light/10 border-forest-light/30",
    "bg-nature-water/10 border-nature-water/30",
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Notizen werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
              <StickyNote className="w-10 h-10 text-primary" />
              Notizen
            </h1>
            <p className="text-muted-foreground">
              {notes.length} Notizen zu deinen Büchern
            </p>
          </div>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Neue Notiz
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fade-in delay-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Notizen durchsuchen..."
              className="pl-10 bg-card/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {notes.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <StickyNote className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Noch keine Notizen
              </h3>
              <p className="text-muted-foreground">
                Erstelle Notizen zu deinen Büchern
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Notes Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, index) => {
              const book = bookMap.get(note.bookId);
              const colorClass = noteColors[index % noteColors.length];
              const formattedDate = new Date(note.createdAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <Card
                  key={note.id}
                  className={`bg-card/80 backdrop-blur-sm border-2 ${colorClass} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in cursor-pointer`}
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-serif text-lg text-foreground line-clamp-2">
                        {note.content.substring(0, 50)}...
                      </CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {note.content}
                    </p>

                    {/* Book Info */}
                    {book && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <BookOpen className="w-3 h-3" />
                        <span className="font-medium text-foreground">{book.title}</span>
                        {note.page && <span>• Seite {note.page}</span>}
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add New Note Card */}
            <Card
              className="bg-card/40 backdrop-blur-sm border-dashed border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer animate-fade-in flex items-center justify-center min-h-[250px]"
              style={{ animationDelay: `${(notes.length + 2) * 100}ms` }}
            >
              <CardContent className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-foreground mb-2">
                  Neue Notiz erstellen
                </h3>
                <p className="text-sm text-muted-foreground">
                  Halte deine Gedanken fest
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
