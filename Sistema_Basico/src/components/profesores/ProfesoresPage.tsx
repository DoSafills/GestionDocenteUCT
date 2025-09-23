import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader} from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogDescription } from "../ui/dialog";

import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";


const BASE_URL = "http://localhost/gestionuctscripts";
const ENDPOINT = `${BASE_URL}/docentes.php`;

export type Docente = {
  docente_rut: string;
  nombre: string;
  email: string;
  pass_hash: string; 
  max_horas_docencia: number;
};

const vacio: Docente = {
  docente_rut: "",
  nombre: "",
  email: "",
  pass_hash: "",
  max_horas_docencia: 0,
};

export function ProfesoresPage() {
  const [items, setItems] = useState<Docente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Docente | null>(null);
  const [form, setForm] = useState<Docente>({ ...vacio });

  const listar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${ENDPOINT}?action=list`, { method: "GET", credentials: "include" });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.message || "Error al cargar");
      setItems(json.data ?? []);
    } catch (e: any) {
      toast.error(e.message || "No se pudo obtener la lista de docentes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { listar(); }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm({ ...vacio });
    setModalAbierto(true);
  };

  const abrirEditar = (d: Docente) => {
    setEditando(d);
    setForm({ ...d });
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const validar = (d: Docente) => {
    if (!d.docente_rut) return "El RUT es obligatorio";
    if (!d.nombre) return "El nombre es obligatorio";
    if (!d.email) return "El email es obligatorio";
    if (String(d.max_horas_docencia).trim() === "" || Number.isNaN(Number(d.max_horas_docencia))) return "max_horas_docencia inválido";
    return null;
  };

  const guardar = async () => {
    const err = validar(form);
    if (err) { toast.error(err); return; }

    try {
      const payload = new URLSearchParams({
        action: editando ? "update" : "create",
        docente_rut: form.docente_rut,
        nombre: form.nombre,
        email: form.email,
        pass_hash: form.pass_hash,
        max_horas_docencia: String(form.max_horas_docencia),
      });
      const res = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.message || "No se pudo guardar");
      toast.success(editando ? "Docente actualizado" : "Docente creado");
      cerrarModal();
      listar();
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const eliminar = async (rut: string) => {
    if (!confirm(`¿Eliminar docente ${rut}?`)) return;
    try {
      const payload = new URLSearchParams({ action: "delete", id: rut });
      const res = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) throw new Error(json?.message || "No se pudo eliminar");
      toast.success("Docente eliminado");
      listar();
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
  };

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return items;
    return items.filter(d =>
      d.docente_rut.toLowerCase().includes(q) ||
      d.nombre.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    );
  }, [items, busqueda]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Gestión de Docentes</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={listar} disabled={cargando}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refrescar
          </Button>
          <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <DialogTrigger asChild>
              <Button onClick={abrirCrear}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo Docente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editando ? "Editar Docente" : "Crear Docente"}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT *</Label>
                  <Input id="rut" value={form.docente_rut}
                         disabled={!!editando}
                         placeholder="12345678-9"
                         onChange={(e) => setForm({ ...form, docente_rut: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" value={form.nombre}
                         onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email}
                         placeholder="docente@universidad.cl"
                         onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass">Pass / Hash</Label>
                  <Input id="pass" type="password" value={form.pass_hash}
                         placeholder="(opcional)" autoComplete="new-password"
                         onChange={(e) => setForm({ ...form, pass_hash: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max">Máx. horas docencia *</Label>
                  <Input id="max" type="number" min={0} value={form.max_horas_docencia}
                         onChange={(e) => setForm({ ...form, max_horas_docencia: Number(e.target.value) })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={cerrarModal}>Cancelar</Button>
                <Button onClick={guardar}>{editando ? "Actualizar" : "Crear"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar por RUT, nombre o email"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Badge variant="outline">{filtrados.length} resultado(s)</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Máx. horas</TableHead>
                  <TableHead className="w-[140px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((d) => (
                  <TableRow key={d.docente_rut}>
                    <TableCell>{d.docente_rut}</TableCell>
                    <TableCell>{d.nombre}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.max_horas_docencia}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => abrirEditar(d)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => eliminar(d.docente_rut)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {cargando ? "Cargando..." : "No hay docentes"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
