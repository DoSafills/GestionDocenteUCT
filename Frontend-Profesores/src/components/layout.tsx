import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 font-bold text-lg">Sistema Académico</div>
        <nav className="flex flex-col space-y-2 p-2">
          <NavLink to="/" className="p-2 rounded hover:bg-gray-700">Dashboard</NavLink>
          <NavLink to="/profesores" className="p-2 rounded hover:bg-gray-700">Profesores</NavLink>
          <NavLink to="/salas" className="p-2 rounded hover:bg-gray-700">Salas y Edificios</NavLink>
          <NavLink to="/horarios" className="p-2 rounded hover:bg-gray-700">Horarios</NavLink>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
}
 