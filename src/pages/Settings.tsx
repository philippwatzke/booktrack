import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Bell, User, Palette, Database, Keyboard, Command } from "lucide-react";

export default function Settings() {
  const settingsSections = [
    {
      icon: User,
      title: "Profil",
      description: "Verwalte deine persönlichen Informationen",
    },
    {
      icon: Bell,
      title: "Benachrichtigungen",
      description: "Konfiguriere Erinnerungen und Updates",
    },
    {
      icon: Palette,
      title: "Darstellung",
      description: "Passe das Design nach deinen Wünschen an",
    },
    {
      icon: Database,
      title: "Daten & Export",
      description: "Exportiere oder lösche deine Bücherdaten",
    },
  ];

  const shortcuts = [
    {
      keys: ["/"],
      alternativeKeys: ["Strg", "K"],
      description: "Bibliothek öffnen / Suche",
      category: "Navigation",
    },
    {
      keys: ["Strg", "H"],
      description: "Zum Dashboard",
      category: "Navigation",
    },
    {
      keys: ["Strg", "N"],
      description: "Neues Buch hinzufügen",
      category: "Aktionen",
      comingSoon: true,
    },
    {
      keys: ["Esc"],
      description: "Dialog schließen",
      category: "Allgemein",
    },
  ];

  const renderKeys = (keys: string[], alternativeKeys?: string[]) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-muted-foreground text-xs">+</span>}
            <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border border-border font-mono text-xs font-semibold">
              {key}
            </kbd>
          </div>
        ))}
      </div>
      {alternativeKeys && (
        <>
          <span className="text-muted-foreground text-xs">oder</span>
          <div className="flex items-center gap-1">
            {alternativeKeys.map((key, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <span className="text-muted-foreground text-xs">+</span>}
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded border border-border font-mono text-xs font-semibold">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Einstellungen</h1>
          <p className="text-muted-foreground">
            Personalisiere deine BookTrack-Erfahrung
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1 mb-6">
            <TabsTrigger value="general" className="rounded-lg">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger value="shortcuts" className="rounded-lg">
              <Keyboard className="h-4 w-4 mr-2" />
              Tastenkürzel
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="space-y-4">
              {settingsSections.map((section) => (
                <Card
                  key={section.title}
                  className="p-6 rounded-2xl border-border shadow-md hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Bearbeiten
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* App Info */}
            <Card className="mt-8 p-6 rounded-2xl border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">BookTrack v1.0.0</p>
                <p>Erstellt mit ❤️ für Bücherliebhaber</p>
              </div>
            </Card>
          </TabsContent>

          {/* Keyboard Shortcuts */}
          <TabsContent value="shortcuts">
            <Card className="p-6 rounded-2xl border-border shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Command className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tastaturkürzel</h2>
                  <p className="text-sm text-muted-foreground">
                    Nutze diese Shortcuts für schnellere Navigation
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Group by category */}
                {["Navigation", "Aktionen", "Allgemein"].map((category) => {
                  const categoryShortcuts = shortcuts.filter((s) => s.category === category);
                  if (categoryShortcuts.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {categoryShortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {shortcut.description}
                                </p>
                                {shortcut.comingSoon && (
                                  <Badge variant="outline" className="text-xs">
                                    Bald verfügbar
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {renderKeys(shortcut.keys, shortcut.alternativeKeys)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Tipp:</strong> Shortcuts funktionieren nicht,
                  wenn du in einem Eingabefeld tippst.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
