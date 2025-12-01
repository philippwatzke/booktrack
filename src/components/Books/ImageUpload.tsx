import { useState, useRef, DragEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      toast({
        title: "Fehler",
        description: "Bitte nur Bilddateien hochladen",
        variant: "destructive",
      });
      return;
    }

    handleFile(imageFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Fehler",
        description: "Bitte nur Bilddateien hochladen",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
      toast({
        title: "Erfolg",
        description: "Bild wurde hochgeladen",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
          className="flex-1 rounded-lg"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
          className="flex-1 rounded-lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          Hochladen
        </Button>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <Label htmlFor="coverUrl">Cover-Bild URL</Label>
          <Input
            id="coverUrl"
            type="url"
            placeholder="https://example.com/cover.jpg"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="rounded-xl h-11"
          />
          <p className="text-xs text-muted-foreground">
            Link zu einem Bild (z.B. von Unsplash, Google Books, etc.)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Cover-Bild hochladen</Label>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className={`
              h-12 w-12 mx-auto mb-3 transition-all
              ${isDragging ? "text-primary scale-110" : "text-muted-foreground"}
            `} />
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? "Loslassen zum Hochladen" : "Bild hierher ziehen"}
            </p>
            <p className="text-xs text-muted-foreground">
              oder klicken zum Auswählen
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG, GIF bis 10MB
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <img
            src={value}
            alt="Cover Vorschau"
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              toast({
                title: "Fehler",
                description: "Bild konnte nicht geladen werden",
                variant: "destructive",
              });
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-xs text-white truncate">
              {mode === "url" ? "URL" : "Hochgeladenes Bild"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
