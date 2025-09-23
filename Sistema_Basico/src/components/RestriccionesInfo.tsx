import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Clock, Users, BookOpen, Award, FileText } from "lucide-react";
import type { Restricciones } from "../types";

interface RestriccionesInfoProps {
  restricciones: Restricciones;
  cumplidas?: {
    edad?: boolean;
    prerrequisitos?: boolean;
    nivel?: boolean;
    experiencia?: boolean;
  };
}

export function RestriccionesInfo({ restricciones, cumplidas = {} }: RestriccionesInfoProps) {
  const restriccionItems = [];

  // Edad
  if (restricciones.edadMinima || restricciones.edadMaxima) {
    let textoEdad = '';
    if (restricciones.edadMinima && restricciones.edadMaxima) {
      textoEdad = `Entre ${restricciones.edadMinima} y ${restricciones.edadMaxima} años`;
    } else if (restricciones.edadMinima) {
      textoEdad = `Mínimo ${restricciones.edadMinima} años`;
    } else if (restricciones.edadMaxima) {
      textoEdad = `Máximo ${restricciones.edadMaxima} años`;
    }

    restriccionItems.push({
      icon: <Users className="w-4 h-4" />,
      texto: textoEdad,
      cumplida: cumplidas.edad,
      tipo: 'edad'
    });
  }

  // Prerrequisitos
  if (restricciones.prerrequisitos && restricciones.prerrequisitos.length > 0) {
    restriccionItems.push({
      icon: <BookOpen className="w-4 h-4" />,
      texto: `Prerrequisitos: ${restricciones.prerrequisitos.join(', ')}`,
      cumplida: cumplidas.prerrequisitos,
      tipo: 'prerrequisitos'
    });
  }

  // Nivel mínimo
  if (restricciones.nivelMinimo) {
    restriccionItems.push({
      icon: <Award className="w-4 h-4" />,
      texto: `Nivel mínimo: ${restricciones.nivelMinimo}`,
      cumplida: cumplidas.nivel,
      tipo: 'nivel'
    });
  }

  // Experiencia mínima
  if (restricciones.experienciaMinima) {
    restriccionItems.push({
      icon: <Clock className="w-4 h-4" />,
      texto: `Experiencia: ${restricciones.experienciaMinima}`,
      cumplida: cumplidas.experiencia,
      tipo: 'experiencia'
    });
  }

  // Documentos requeridos
  if (restricciones.documentosRequeridos && restricciones.documentosRequeridos.length > 0) {
    restriccionItems.push({
      icon: <FileText className="w-4 h-4" />,
      texto: `Documentos: ${restricciones.documentosRequeridos.join(', ')}`,
      cumplida: true, // Los documentos se asumen como un requisito general
      tipo: 'documentos'
    });
  }

  if (restriccionItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Requisitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay requisitos especiales para este curso.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Requisitos y Restricciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {restriccionItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.texto}</p>
              </div>
              <div className="flex-shrink-0">
                {item.cumplida === true && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Cumple
                  </Badge>
                )}
                {item.cumplida === false && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                    <XCircle className="w-3 h-3 mr-1" />
                    No cumple
                  </Badge>
                )}
                {item.cumplida === undefined && (
                  <Badge variant="outline">
                    Requerido
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}