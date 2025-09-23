import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Clock, Users, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import type { Curso } from "../types";
import { formatearFecha, calcularProgreso } from "../utils/validaciones";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CursoCardProps {
  curso: Curso;
  onInscribirse: (curso: Curso) => void;
  puedeInscribirse: boolean;
  restriccionesCumplidas: boolean;
}

export function CursoCard({ curso, onInscribirse, puedeInscribirse, restriccionesCumplidas }: CursoCardProps) {
  const progresoCupos = calcularProgreso(curso.cuposDisponibles, curso.cuposTotal);
  const fechaLimiteInscripcion = new Date(curso.fechaFinInscripcion);
  const fechaActual = new Date();
  const inscripcionesAbiertas = fechaActual <= fechaLimiteInscripcion;

  const getImageUrl = (query: string) => {
    const imageMap: { [key: string]: string } = {
      'programming basics': 'https://images.unsplash.com/photo-1505238680356-667803448bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGJhc2ljc3xlbnwxfHx8fDE3NTc0ODE0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'web development': 'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NTczOTY2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'data science': 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZXxlbnwxfHx8fDE3NTc0ODE0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'ux ui design': 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1eCUyMHVpJTIwZGVzaWdufGVufDF8fHx8MTc1NzQyNzY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'digital marketing': 'https://images.unsplash.com/photo-1557838923-2985c318be48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDF8fHx8MTc1NzQ4MTQxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    };
    return imageMap[query] || 'https://images.unsplash.com/photo-1505238680356-667803448bb6';
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={getImageUrl(curso.imagen)}
          alt={curso.nombre}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className={`absolute top-3 right-3 ${getNivelColor(curso.nivel)}`}>
          {curso.nivel}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2">{curso.nombre}</CardTitle>
        <p className="text-muted-foreground line-clamp-2">{curso.descripcion}</p>
        <p className="text-sm">Instructor: {curso.instructor}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {curso.duracion}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${curso.precio}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Cupos: {curso.cuposDisponibles}/{curso.cuposTotal}
              </div>
              <span className={curso.cuposDisponibles === 0 ? 'text-red-600' : 'text-green-600'}>
                {curso.cuposDisponibles === 0 ? 'Completo' : 'Disponible'}
              </span>
            </div>
            <Progress value={progresoCupos} className="h-2" />
          </div>

          <div className="text-sm space-y-1">
            <p>Inicio: {formatearFecha(curso.fechaInicio)}</p>
            <p className={!inscripcionesAbiertas ? 'text-red-600' : ''}>
              Inscripciones hasta: {formatearFecha(curso.fechaFinInscripcion)}
            </p>
          </div>

          {!restriccionesCumplidas && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">No cumples algunos requisitos</span>
            </div>
          )}

          {restriccionesCumplidas && puedeInscribirse && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Cumples todos los requisitos</span>
            </div>
          )}
        </div>

        <Button 
          onClick={() => onInscribirse(curso)}
          disabled={!puedeInscribirse || !inscripcionesAbiertas}
          className="w-full"
          variant={puedeInscribirse && inscripcionesAbiertas ? "default" : "secondary"}
        >
          {!inscripcionesAbiertas 
            ? "Inscripciones cerradas" 
            : curso.cuposDisponibles === 0 
              ? "Sin cupos" 
              : "Inscribirse"
          }
        </Button>
      </CardContent>
    </Card>
  );
}