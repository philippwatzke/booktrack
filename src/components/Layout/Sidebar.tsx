import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Heart,
  BarChart3,
  Quote,
  Settings,
  Search,
  ChevronLeft,
  Leaf,
  Target,
  StickyNote,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Library, label: "Meine Bibliothek", path: "/library" },
  { icon: BookOpen, label: "Aktuell Lesen", path: "/reading" },
  { icon: Heart, label: "Wunschliste", path: "/wishlist" },
  { icon: BookMarked, label: "Kollektionen", path: "/collections" },
  { icon: Quote, label: "Zitate", path: "/quotes" },
  { icon: StickyNote, label: "Notizen", path: "/notes" },
  { icon: Target, label: "Ziele", path: "/goals" },
  { icon: BarChart3, label: "Statistiken", path: "/stats" },
  { icon: Search, label: "Bücher Suchen", path: "/search" },
  { icon: Settings, label: "Einstellungen", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { data: streakData } = useStreak();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sidebar-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-32 h-32 bg-sidebar-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary/20">
            <Leaf className="w-6 h-6 text-sidebar-primary animate-sway" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-xl font-serif font-bold text-sidebar-foreground">
                BookTrack
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Dein Lesebegleiter</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive && "text-sidebar-primary-foreground"
                  )}
                />
                {!collapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && streakData && (
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <p className="text-xs text-sidebar-foreground/60 font-medium">
                🌿 Lese-Streak
              </p>
              <p className="text-2xl font-serif font-bold text-sidebar-primary">
                {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Tag' : 'Tage'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
