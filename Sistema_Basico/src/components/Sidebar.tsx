import { Home, Users, BookOpen, Building, Clock, AlertTriangle, GraduationCap } from "lucide-react";

interface SidebarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profesores", label: "Profesores", icon: Users },
    { id: "salas", label: "Salas y Edificios", icon: Building },
    { id: "asignaturas", label: "Asignaturas", icon: BookOpen },
    { id: "horarios", label: "Horarios", icon: Clock },
    { id: "restricciones", label: "Restricciones", icon: AlertTriangle },
    { id: "cursos", label: "Cursos Extensión", icon: GraduationCap }
  ];

  return (
    <aside className="fixed left-0 top-200 w-64 h-screen bg-gray-900 text-white overflow-hidden z-50 mx-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Sistema Académico</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange?.(item.id)}
                className={`w-full flex items-center gap-2 p-2 rounded transition-colors text-left ${
                  isActive 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
