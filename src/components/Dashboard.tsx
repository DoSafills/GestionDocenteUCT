import Card from "./Card";

function Dashboard() {
  return (
    <main className="p-6 bg-gray-900 text-white flex-1">
      <p className="text-gray-400 mb-6">
        Resumen general del sistema académico
      </p>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Profesores" value="Conectar módulo Profesores" />
        <Card title="Salas" value="Conectar módulo Salas" />
        <Card title="Asignaturas" value="Conectar módulo Asignaturas" />
        <Card title="Restricciones" value="Conectar módulo Restricciones" />
      </div>

      {/* Distribución 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">Asignaturas por Carrera</h3>
            <div className="text-gray-500 text-sm">
              ➜ Conectar con vista de Asignaturas
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">Utilización de Edificios</h3>
            <div className="text-gray-500 text-sm">
              ➜ Conectar con módulo de Edificios
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">Alertas del Sistema</h3>
            <div className="text-gray-500 text-sm">
              ➜ Conectar con módulo de Alertas
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">Próximas Tareas</h3>
            <div className="text-gray-500 text-sm">
              ➜ Conectar con módulo de Tareas
            </div>
          </div>
        </div>
      </div>

      {/* Estado general */}
      <div className="bg-gray-800 rounded-lg p-6 shadow mt-8">
        <h3 className="font-semibold text-lg mb-4">Estado General del Sistema</h3>
        <div className="text-gray-500 text-sm">
          ➜ Conectar con resumen del sistema
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
