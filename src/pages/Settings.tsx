import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Bell, User, Palette, Database } from "lucide-react";

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

        {/* Settings Cards */}
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
      </div>
    </div>
  );
}
