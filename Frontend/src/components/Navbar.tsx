import "./Navbar.css";
import logoUCT from "../assets/logo-uct.png";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  BookOpen,
  CalendarDays,
  Settings,
  GraduationCap,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : undefined;

  return (
    <header className="uct-navbar">
      <div className="uct-navbar__content">
        <div className="uct-navbar__left">
          <NavLink to="/dashboard" aria-label="Dashboard">
            <img src={logoUCT} alt="Universidad Católica de Temuco" className="uct-logo" />
          </NavLink>
        </div>

        <nav className="uct-navbar__menu" aria-label="Principal">
          <NavLink to="/dashboard" className={linkClass}>
            <Home size={18} /> Dashboard
          </NavLink>
          <NavLink to="/profesores" className={linkClass}>
            <Users size={18} /> Profesores
          </NavLink>
          <NavLink to="/salas" className={linkClass}>
            <Building2 size={18} /> Salas y Edificios
          </NavLink>
          <NavLink to="/asignaturas" className={linkClass}>
            <BookOpen size={18} /> Asignaturas
          </NavLink>
          <NavLink to="/horarios" className={linkClass}>
            <CalendarDays size={18} /> Horarios
          </NavLink>
          <NavLink to="/restricciones" className={linkClass}>
            <Settings size={18} /> Restricciones
          </NavLink>
          <NavLink to="/cursos-extension" className={linkClass}>
            <GraduationCap size={18} /> Cursos Extensión
          </NavLink>
        </nav>

        <div className="uct-navbar__right">
          <button className="uct-iconbtn" aria-label="Notificaciones">
            <Bell size={18} />
          </button>
          <button className="uct-iconbtn" aria-label="Usuario">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
