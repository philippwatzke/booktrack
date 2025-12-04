import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, X, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  publishedYear?: number;
}

interface BookCollectionItem {
  id: string;
  bookId: string;
  status: string;
  order?: number;
  book: Book;
}

interface AlbumGridProps {
  books: BookCollectionItem[];
  collectionType: string;
  onEditBook: (bookId: string, status: string) => void;
  onRemoveBook: (bookId: string) => void;
  onAddBook: () => void;
  onReorder?: (items: BookCollectionItem[]) => void;
  showPlaceholders?: boolean;
  targetCount?: number;
}

interface SortableBookCardProps {
  bookCollection: BookCollectionItem;
  onEdit: (bookId: string, status: string) => void;
  onRemove: (bookId: string) => void;
  isDragging?: boolean;
}

function SortableBookCard({ bookCollection, onEdit, onRemove, isDragging }: SortableBookCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: bookCollection.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const book = bookCollection.book;

  const getStatusColor = (status: string) => {
    const colors = {
      COLLECTED: "border-green-500/30 bg-green-500/5",
      WISHLIST: "border-yellow-500/30 bg-yellow-500/5",
      MISSING: "border-red-500/30 bg-red-500/5",
    };
    return colors[status as keyof typeof colors] || "";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      COLLECTED: { label: "✓", className: "bg-green-500" },
      WISHLIST: { label: "★", className: "bg-yellow-500" },
      MISSING: { label: "?", className: "bg-red-500" },
    };
    const badge = badges[status as keyof typeof badges];
    return badge ? (
      <div className={`absolute top-2 left-2 w-6 h-6 rounded-full ${badge.className} flex items-center justify-center text-white text-xs font-bold shadow-md z-10`}>
        {badge.label}
      </div>
    ) : null;
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`rounded-xl overflow-hidden border-2 ${getStatusColor(bookCollection.status)} transition-all hover:shadow-lg group relative`}>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-1.5 shadow-md">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Status Badge */}
        {getStatusBadge(bookCollection.status)}

        {/* Book Cover - Sticker Style */}
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-12 w-12 text-primary opacity-50" />
            </div>
          )}

          {/* Action Buttons - Show on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book.id, bookCollection.status);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="rounded-full shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(book.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Book Info - Compact */}
        <div className="p-3">
          <h4 className="font-semibold text-xs line-clamp-2 mb-1 leading-tight">
            {book.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author}
          </p>
          {bookCollection.order && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-primary/10 rounded-full">
              <span className="text-xs font-bold text-primary">
                #{bookCollection.order}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function PlaceholderCard({ number, onClick }: { number: number; onClick: () => void }) {
  return (
    <Card
      className="rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/30 bg-muted/20 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto group-hover:bg-primary/20 transition-colors">
            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Fehlend
          </p>
        </div>
      </div>
      <div className="p-3 text-center">
        <p className="text-xs text-muted-foreground">
          Buch #{number}
        </p>
      </div>
    </Card>
  );
}

export function AlbumGrid({
  books,
  collectionType,
  onEditBook,
  onRemoveBook,
  onAddBook,
  onReorder,
  showPlaceholders = false,
  targetCount,
}: AlbumGridProps) {
  const [items, setItems] = useState(books);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync items with books prop when it changes
  useEffect(() => {
    setItems(books);
  }, [books]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order numbers
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        if (onReorder) {
          onReorder(updatedItems);
        }

        return updatedItems;
      });
    }
  }

  // Calculate placeholders
  const placeholderCount = showPlaceholders && targetCount
    ? Math.max(0, targetCount - books.length)
    : 0;

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((bc) => (
              <SortableBookCard
                key={bc.id}
                bookCollection={bc}
                onEdit={onEditBook}
                onRemove={onRemoveBook}
                isDragging={activeId === bc.id}
              />
            ))}

            {/* Placeholder Cards */}
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <PlaceholderCard
                key={`placeholder-${index}`}
                number={books.length + index + 1}
                onClick={onAddBook}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {books.length === 0 && !showPlaceholders && (
        <Card className="p-12 rounded-2xl text-center border-dashed">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Keine Bücher</h3>
          <p className="text-muted-foreground mb-6">
            Füge Bücher zu dieser Sammlung hinzu
          </p>
          <Button onClick={onAddBook} className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Buch hinzufügen
          </Button>
        </Card>
      )}
    </div>
  );
}
