import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CalendarDays, Edit, Mail, Tags, Trash2, User } from "lucide-react";
import type { Docente } from "../types";

type Row = { dia: string; horario: string };

type Props = {
  docente: Docente;
  rows: Row[];
  onEditar: (d: Docente) => void;
  onEliminar: (d: Docente) => void;
};

export default function TarjetaDocente({ docente, rows, onEditar, onEliminar }: Props) {
  const especialidades = (docente.especialidad || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <Card className="rounded-xl shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{docente.nombre}</CardTitle>
              <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-sm text-gray-700">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${docente.esta_activo ? "bg-emerald-500" : "bg-gray-400"}`} />
                {docente.esta_activo ? "activo" : "inactivo"}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEditar(docente)} aria-label={`Editar docente ${docente.nombre}`}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEliminar(docente)} aria-label={`Eliminar docente ${docente.nombre}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 text-sm">
        <div>
          <div className="flex items-center gap-2 font-medium mb-1">
            <Mail className="h-4 w-4" />
            <span>Correo</span>
          </div>
          <p className="text-muted-foreground">{docente.email}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 font-medium mb-1">
            <Tags className="h-4 w-4" />
            <span>Especialidades</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {especialidades.length ? (
              especialidades.map((e, i) => (
                <Badge key={i} variant="outline" className="text-xs rounded-lg">
                  {e}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Sin especialidades</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-medium mb-1">
            <CalendarDays className="h-4 w-4" />
            <span>Disponibilidad</span>
          </div>
          {rows.length ? (
            <div className="overflow-visible rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="py-1.5 px-2">Día</th>
                    <th className="py-1.5 px-2">Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-1.5 px-2">{r.dia}</td>
                      <td className="py-1.5 px-2">{r.horario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Sin restricciones activas</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
