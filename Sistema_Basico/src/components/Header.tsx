import React from "react";
import { FiUsers, FiBarChart, FiBookOpen, FiFileText, FiAward } from "react-icons/fi";
import logo from "../img/logo.png"; // Importa la imagen desde src

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <a href="index.php" className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto mr-2" />
      </a>

      {/* Menú de navegación */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <a href="equipo.php" className="flex items-center hover:text-green-400">
              <FiUsers className="mr-1" /> Docentes
            </a>
          </li>
          <li>
            <a href="Historia.php" className="flex items-center hover:text-green-400">
              <FiBarChart className="mr-1" /> Salas
            </a>
          </li>
          <li>
            <a href="Quienes.php" className="flex items-center hover:text-green-400">
              <FiBookOpen className="mr-1" /> Asignaturas
            </a>
          </li>
          <li>
            <a href="Quienes.php" className="flex items-center hover:text-green-400">
              <FiFileText className="mr-1" /> Reportes
            </a>
          </li>
          <li>
            <a href="Quienes.php" className="flex items-center hover:text-green-400">
              <FiAward className="mr-1" /> Generar salas
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
