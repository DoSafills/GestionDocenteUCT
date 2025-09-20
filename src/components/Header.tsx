function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h2 className="text-lg font-bold">Dashboard</h2>
      <div className="text-sm">
        <span className="font-semibold">Administrador</span> <br />
        <span className="text-gray-400">Sistema v2.0</span>
      </div>
    </header>
  );
}

export default Header;
