// src/components/Layout.tsx
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  Users, 
  Building, 
  BookOpen, 
  Settings, 
  Home,
  GraduationCap,
  Calendar
} from "lucide-react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profesores", label: "Profesores", icon: Users },
    { id: "salas", label: "Salas y Edificios", icon: Building },
    { id: "asignaturas", label: "Asignaturas", icon: BookOpen },
    { id: "horarios", label: "Horarios", icon: Calendar },
    { id: "restricciones", label: "Restricciones", icon: Settings },
    { id: "cursos", label: "Cursos Extensión", icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col text-black">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-80px)] text-black">
          <Card className="m-4 border-0 shadow-none">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm mb-4">NAVEGACIÓN</h3>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 transition-colors duration-200 text-black ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                    }`}
                    onClick={() => onPageChange(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 text-black">
          {children}
        </main>
      </div>
    </div>
  );
}
