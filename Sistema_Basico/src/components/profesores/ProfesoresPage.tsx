import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const BASE_URL = "http://localhost/gestionuctscripts"; 
const ENDPOINT = `${BASE_URL}/docentes.php`;

export type Profesor = {
  docente_rut: string;
  nombre: string;
  email: string;
  pass_hash: string;
  max_horas_docencia: number;
};

const vacio: Profesor = {
  docente_rut: "",
  nombre: "",
  email: "",
  pass_hash: "",
  max_horas_docencia: 0,
};

export function ProfesoresPage() {
  const [items, setItems] = useState<Profesor[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Profesor | null>(null);
  const [form, setForm] = useState<Profesor>({ ...vacio });

  const listar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${ENDPOINT}?action=list`, { method: "GET", credentials: "include" });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { throw new Error("Respuesta no-JSON del servidor"); }
      const ok = json?.ok ?? json?.success ?? false;
      const data = json?.data ?? json?.rows ?? (Array.isArray(json) ? json : []);
      if (!res.ok || ok === false) throw new Error(json?.message || "Error al cargar");
      if (!Array.isArray(data)) throw new Error("Formato inesperado de 'data'");
      setItems(data);
    } catch (e: any) {
      toast.error(e.message || "No se pudo obtener la lista de profesores");
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

  const abrirEditar = (p: Profesor) => {
    setEditando(p);
    setForm({ ...p });
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const validar = (p: Profesor) => {
    if (!p.docente_rut) return "El RUT es obligatorio";
    if (!p.nombre) return "El nombre es obligatorio";
    if (!p.email) return "El email es obligatorio";
    if (String(p.max_horas_docencia).trim() === "" || Number.isNaN(Number(p.max_horas_docencia))) return "Máx. horas inválido";
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
      toast.success(editando ? "Profesor actualizado" : "Profesor creado");
      cerrarModal();
      listar();
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const eliminar = async (rut: string) => {
    if (!confirm(`¿Eliminar profesor ${rut}?`)) return;
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
      toast.success("Profesor eliminado");
      listar();
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
  };

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return items;
    return items.filter(p =>
      p.docente_rut.toLowerCase().includes(q) ||
      p.nombre.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  }, [items, busqueda]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Gestión de Profesores</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={listar} disabled={cargando}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refrescar
          </Button>
          <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <DialogTrigger asChild>
              <button onClick={abrirCrear} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Plus className="w-4 h-4 mr-2" /> Nuevo Profesor
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-black">{editando ? "Editar Profesor" : "Crear Profesor"}</DialogTitle>
                <DialogDescription className="text-black">Completa los datos del profesor y guarda los cambios.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 pt-2 text-black">
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
                         placeholder="profesor@universidad.cl"
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

              <div className="flex justify-end gap-3 pt-4 text-black">
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
                {filtrados.map((p) => (
                  <TableRow key={p.docente_rut}>
                    <TableCell>{p.docente_rut}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.max_horas_docencia}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => abrirEditar(p)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => eliminar(p.docente_rut)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {cargando ? "Cargando..." : "No hay profesores"}
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
