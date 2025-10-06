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
      'programming basics': 'https://images.unsplash.com/photo-1505238680356-667803448bb6',
      'web development': 'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89',
      'data science': 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86',
      'ux ui design': 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c',
      'digital marketing': 'https://images.unsplash.com/photo-1557838923-2985c318be48'
    };
    return imageMap[query] || 'https://images.unsplash.com/photo-1505238680356-667803448bb6';
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Principiante': return 'bg-green-100 text-black';
      case 'Intermedio': return 'bg-yellow-100 text-black';
      case 'Avanzado': return 'bg-red-100 text-black';
      default: return 'bg-gray-100 text-black';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow bg-gray-100 text-black">
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
        <CardTitle className="line-clamp-2 text-black">{curso.nombre}</CardTitle>
        <p className="line-clamp-2 text-black">{curso.descripcion}</p>
        <p className="text-sm text-black">Instructor: {curso.instructor}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-black">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {curso.duracion}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${curso.precio}
            </div>
          </div>

          <div className="space-y-2 text-black">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Cupos: {curso.cuposDisponibles}/{curso.cuposTotal}
              </div>
              <span>
                {curso.cuposDisponibles === 0 ? 'Completo' : 'Disponible'}
              </span>
            </div>
            <Progress value={progresoCupos} className="h-2" />
          </div>

          <div className="text-sm space-y-1 text-black">
            <p>Inicio: {formatearFecha(curso.fechaInicio)}</p>
            <p>
              Inscripciones hasta: {formatearFecha(curso.fechaFinInscripcion)}
            </p>
          </div>

          {!restriccionesCumplidas && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-black">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">No cumples algunos requisitos</span>
            </div>
          )}

          {restriccionesCumplidas && puedeInscribirse && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200 text-black">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Cumples todos los requisitos</span>
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
