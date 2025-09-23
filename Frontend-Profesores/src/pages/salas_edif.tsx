import { edificios } from "../services/salasService";
import RoomCard from "../components/roomcards";

export default function SalasEdificios() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Salas y Edificios</h1>

      {edificios.map((edificio) => (
        <div key={edificio.id} className="mb-8">
          <h2 className="text-xl font-semibold">{edificio.nombre}</h2>
          <p className="text-gray-600">{edificio.direccion}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {edificio.salas.map((sala) => (
              <RoomCard key={sala.id} sala={sala} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
