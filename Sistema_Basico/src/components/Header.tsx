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
    </header>
  );
}

export default Header;
