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
  Grid3x3
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  { title: "Zitate & Notizen", url: "/quotes", icon: Quote },
];

const otherItems = [
  { title: "Statistiken", url: "/stats", icon: BarChart3 },
  { title: "Einstellungen", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">BookTrack</h2>
              <p className="text-xs text-muted-foreground">Deine Leseübersicht</p>
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
              {mainItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && <span>{item.title}</span>}
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
              {organizationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && <span>{item.title}</span>}
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
              {otherItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {open && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {open && <span>Abmelden</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
