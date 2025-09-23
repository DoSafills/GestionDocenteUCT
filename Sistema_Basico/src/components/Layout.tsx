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
    <div className="min-h-screen bg-background">
      {/* Header con degradado azul */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-4 shadow-lg border-b border-blue-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-100" />
              <div>
                <h1 className="text-2xl font-semibold text-white">Sistema Académico</h1>
                <p className="text-sm text-blue-100 opacity-90">Gestión Integral de Cursos y Asignaturas</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-blue-100 opacity-90">Administrador</p>
              <p className="text-xs text-blue-200 opacity-75">Sistema v2.0</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-80px)]">
          <Card className="m-4 border-0 shadow-none bg-transparent">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm text-muted-foreground mb-4 font-medium">NAVEGACIÓN</h3>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                        : "text-muted-foreground hover:bg-blue-900/20 hover:text-blue-300"
                    }`}
                    onClick={() => onPageChange(item.id)}
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}