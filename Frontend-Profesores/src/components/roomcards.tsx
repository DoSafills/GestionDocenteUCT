type Asignatura = {
  codigo: string;
  nombre: string;
  horario: string;
};

type Sala = {
  id: string;
  tipo: string;
  estado: string;
  capacidad: number;
  equipamiento: string[];
  asignaturas: Asignatura[];
};

export default function RoomCard({ sala }: { sala: Sala }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{sala.id} ({sala.tipo})</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            sala.estado === "Disponible"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {sala.estado}
        </span>
      </div>
      <p className="text-sm mt-2">Capacidad: {sala.capacidad} personas</p>
      <p className="text-sm mt-2">Equipamiento: {sala.equipamiento.join(", ")}</p>
      <div className="mt-3">
        <p className="font-semibold text-sm">Asignaturas:</p>
        {sala.asignaturas.map((a) => (
          <div key={a.codigo} className="text-sm bg-gray-100 p-2 rounded mt-1">
            <strong>{a.codigo}</strong> - {a.nombre}
            <br />
            <span className="text-gray-600">{a.horario}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
