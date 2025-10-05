import { Card, CardContent } from "../../../components/ui/card";
import type { EstadisticasHorariosProps } from "../types/componentes";

export function EstadisticasHorarios({ estadisticas, cargando = false }: EstadisticasHorariosProps) {

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
        </CardContent>
      </Card>
    );
  }

  const getDayName = (dayNumber: string) => {
    const days = {
      '1': 'Lunes',
      '2': 'Martes', 
      '3': 'Miércoles',
      '4': 'Jueves',
      '5': 'Viernes',
      '6': 'Sábado',
      '7': 'Domingo'
    };
    return days[dayNumber as keyof typeof days] || `Día ${dayNumber}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total de clases */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-2xl font-bold">{estadisticas.totalClases}</p>
              <p className="text-sm text-muted-foreground">Total Clases</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clases activas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-2xl font-bold">
                {estadisticas.clasesPorEstado?.['Activo'] || 0}
              </p>
              <p className="text-sm text-muted-foreground">Clases Activas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clases programadas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-2xl font-bold">
                {estadisticas.clasesPorEstado?.['Programado'] || 0}
              </p>
              <p className="text-sm text-muted-foreground">Programadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Día con más clases */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-2xl font-bold">
                {Math.max(...Object.values(estadisticas.clasesPorDia)) || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                {getDayName(
                  Object.entries(estadisticas.clasesPorDia)
                    .reduce((max, [dia, cantidad]) => 
                      cantidad > (estadisticas.clasesPorDia[max] || 0) ? dia : max, 
                      Object.keys(estadisticas.clasesPorDia)[0] || '1'
                    )
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}