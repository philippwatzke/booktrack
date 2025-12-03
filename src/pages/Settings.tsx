import { MainLayout } from "@/components/layout/MainLayout";
import { NatureBackground } from "@/components/nature/NatureBackground";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/hooks/useGoals";
import { useState } from "react";

export default function Settings() {
  const { data: preferences, isLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const [darkMode, setDarkMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [readingReminders, setReadingReminders] = useState(true);
  const [goalUpdates, setGoalUpdates] = useState(true);
  const [streakWarning, setStreakWarning] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <NatureBackground />
        <div className="relative p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Einstellungen werden geladen...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NatureBackground />

      <div className="relative p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Einstellungen
          </h1>
          <p className="text-muted-foreground">
            Personalisiere dein Blätterwald-Erlebnis
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profil
              </CardTitle>
              <CardDescription>
                Verwalte deine persönlichen Informationen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Dein Name" defaultValue="Max Mustermann" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="deine@email.de" defaultValue="max@example.de" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Erzähl etwas über dich..." defaultValue="Leidenschaftlicher Leser seit 2010" />
              </div>
              <Button>Änderungen speichern</Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Erscheinungsbild
              </CardTitle>
              <CardDescription>
                Passe das Aussehen der App an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Dunkelmodus</p>
                    <p className="text-sm text-muted-foreground">
                      Reduziert Augenbelastung bei Nacht
                    </p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Animationen</p>
                    <p className="text-sm text-muted-foreground">
                      Blätter und Naturanimationen aktivieren
                    </p>
                  </div>
                </div>
                <Switch
                  checked={animations}
                  onCheckedChange={setAnimations}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Benachrichtigungen
              </CardTitle>
              <CardDescription>
                Verwalte deine Benachrichtigungseinstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Leseerinnerungen</p>
                  <p className="text-sm text-muted-foreground">
                    Tägliche Erinnerung zum Lesen
                  </p>
                </div>
                <Switch
                  checked={readingReminders}
                  onCheckedChange={setReadingReminders}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Ziel-Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen bei Zielerreichung
                  </p>
                </div>
                <Switch
                  checked={goalUpdates}
                  onCheckedChange={setGoalUpdates}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Streak-Warnung</p>
                  <p className="text-sm text-muted-foreground">
                    Warnung wenn Streak in Gefahr ist
                  </p>
                </div>
                <Switch
                  checked={streakWarning}
                  onCheckedChange={setStreakWarning}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="bg-card/80 backdrop-blur-sm border-border animate-fade-in delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Datenschutz & Daten
              </CardTitle>
              <CardDescription>
                Verwalte deine Daten und Privatsphäre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Profil öffentlich</p>
                  <p className="text-sm text-muted-foreground">
                    Andere können dein Profil sehen
                  </p>
                </div>
                <Switch
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>

              <Separator />

              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Daten exportieren
                </Button>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Konto löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
