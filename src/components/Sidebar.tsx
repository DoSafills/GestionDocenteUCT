import { Home, Users, BookOpen, Building, Clock, AlertTriangle } from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">Sistema Académico</h1>
      <nav className="space-y-2">
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <Home size={18}/> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <Users size={18}/> Profesores
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <Building size={18}/> Salas y Edificios
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <BookOpen size={18}/> Asignaturas
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <Clock size={18}/> Horarios
        </a>
        <a href="#" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
          <AlertTriangle size={18}/> Restricciones
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
