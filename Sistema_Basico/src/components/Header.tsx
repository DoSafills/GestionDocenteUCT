import logo from "../img/logo.png"; // Importa la imagen desde src

function Header() {
  return (
    <header className="fixed top-2 left-2 right-2 bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-50 rounded-2xl">
      {/* Logo */}
      <a href="index.php" className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-auto mr-2 " />
      </a>
    </header>
  );
}

export default Header;
