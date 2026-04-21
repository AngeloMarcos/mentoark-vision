import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";

  return (
    <header className="relative h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
      {/* Linha degradê na base do header */}
      <div className="absolute bottom-0 left-0 right-0 h-px gradient-brand opacity-60 pointer-events-none" />

      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {/* Notificações */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full gradient-brand" />
        </Button>

        {/* Toggle tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Avatar degradê */}
        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-semibold ml-1 glow-primary">
          {initials}
        </div>
      </div>
    </header>
  );
}
