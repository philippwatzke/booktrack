import {
  Library,
  BookOpen,
  BookCheck,
  BookmarkPlus,
  Tags,
  Quote,
  BarChart3,
  Settings,
  LogOut,
  LayoutDashboard,
  Grid3x3,
  Leaf,
  Heart,
  StickyNote,
  Target,
  Search
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStreak } from "@/hooks/useStreak";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Bibliothek", url: "/library", icon: Library },
  { title: "Aktuell lesen", url: "/reading", icon: BookOpen },
  { title: "Gelesen", url: "/finished", icon: BookCheck },
  { title: "Wunschliste", url: "/wishlist", icon: BookmarkPlus },
];

const organizationItems = [
  { title: "Sammelalbum", url: "/collections", icon: Grid3x3 },
  { title: "Tags & Kategorien", url: "/tags", icon: Tags },
  { title: "Zitate", url: "/quotes", icon: Quote },
  { title: "Notizen", url: "/notes", icon: StickyNote },
];

const otherItems = [
  { title: "Ziele", url: "/goals", icon: Target },
  { title: "Statistiken", url: "/stats", icon: BarChart3 },
  { title: "Bücher Suchen", url: "/search", icon: Search },
  { title: "Einstellungen", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data: streakData } = useStreak();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sidebar-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-32 h-32 bg-sidebar-primary/5 rounded-full blur-2xl" />
      </div>

      <SidebarHeader className="border-b border-sidebar-border px-6 py-6 relative">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/20">
            <Leaf className="h-6 w-6 text-sidebar-primary animate-sway" />
          </div>
          {open && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-serif font-bold text-sidebar-foreground">BookTrack</h2>
              <p className="text-xs text-sidebar-foreground/60">Dein Lesebegleiter</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            Hauptmenü
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive && "text-sidebar-primary-foreground"
                        }`} />
                        {open && <span className="font-medium text-sm truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
            Organisation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizationItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                        style={{ animationDelay: `${(mainItems.length + index) * 50}ms` }}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive && "text-sidebar-primary-foreground"
                        }`} />
                        {open && <span className="font-medium text-sm truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        }`}
                        style={{ animationDelay: `${(mainItems.length + organizationItems.length + index) * 50}ms` }}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive && "text-sidebar-primary-foreground"
                        }`} />
                        {open && <span className="font-medium text-sm truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 relative">
        {open && streakData && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="text-xs text-sidebar-foreground/60 font-medium">
              🌿 Lese-Streak
            </p>
            <p className="text-2xl font-serif font-bold text-sidebar-primary">
              {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Tag' : 'Tage'}
            </p>
          </div>
        )}

        {open && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name || user.email}</p>
            <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {open && <span className="font-medium text-sm">Abmelden</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
