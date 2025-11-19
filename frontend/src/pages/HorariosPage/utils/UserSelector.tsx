import { useState, useEffect } from "react";
import { ChevronDown, Shield, User, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authService, type UsuarioActual, type Rol } from "@/application/services/AuthService";

// Funciones helper para simular setUsuarioManual sin modificar AuthService
const setUsuarioDemo = (user: UsuarioActual) => {
  // Guardar usuario demo en localStorage para que otros componentes puedan acceder
  localStorage.setItem('demo_user', JSON.stringify(user));
  localStorage.setItem('mock_login_email', user.email);
  
  // Forzar una recarga del usuario desde la "API" (que usará el mock)
  authService.cargarUsuarioDesdeApi();
};

const getUsuarioDemo = (): UsuarioActual | null => {
  const stored = localStorage.getItem('demo_user');
  return stored ? JSON.parse(stored) : null;
};

// Usuarios de prueba para desarrollo basados en credenciales reales
const USUARIOS_DEMO = [
  {
    id: 1,
    nombre: "admin",
    email: "admin@inf.uct.cl",
    activo: true,
    rol: "ADMINISTRADOR" as Rol,
  },
  {
    id: 201,
    nombre: "docente",
    email: "docente@uct.cl",
    activo: true,
    rol: "DOCENTE" as Rol,
  },
  {
    id: 301,
    nombre: "estudiante", 
    email: "estudiante@alu.uct.cl",
    activo: true,
    rol: "ESTUDIANTE" as Rol,
  },
  // Mantener docentes adicionales para pruebas con datos mock
  {
    id: 202,
    nombre: "Luis García",
    email: "luis.garcia@uct.cl",
    activo: true,
    rol: "DOCENTE" as Rol,
  },
  {
    id: 203,
    nombre: "María López",
    email: "maria.lopez@uct.cl",
    activo: true,
    rol: "DOCENTE" as Rol,
  },
];

const getRolColor = (rol: Rol) => {
  switch (rol) {
    case "ADMINISTRADOR":
      return "bg-red-100 text-red-800 border-red-200";
    case "DOCENTE":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ESTUDIANTE":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getRolLabel = (rol: Rol) => {
  switch (rol) {
    case "ADMINISTRADOR":
      return "Administrador";
    case "DOCENTE":
      return "Docente";
    case "ESTUDIANTE":
      return "Estudiante";
    default:
      return rol;
  }
};

export function UserSelector() {
  // Forzar modo mock para debugging
  const mockEnvValue = import.meta.env.VITE_AUTH_MOCK;
  const isMockMode = true; // Temporalmente forzado para debugging
  
  console.log('[UserSelector] VITE_AUTH_MOCK:', mockEnvValue);
  console.log('[UserSelector] isMockMode forzado a:', isMockMode);
  
  const [usuario, setUsuario] = useState<UsuarioActual | null>(
    getUsuarioDemo() || authService.getUsuarioActual()
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Solo establecer usuario demo en modo mock
    if (isMockMode && !authService.getUsuarioActual()) {
      console.log('[UserSelector] Estableciendo usuario admin por defecto');
      setUsuarioDemo(USUARIOS_DEMO[0]);
    }

    // Suscribirse a cambios del usuario
    const unsub = authService.onChange((user) => {
      console.log('[UserSelector] Usuario cambiado:', user);
      setUsuario(user);
    });

    return unsub;
  }, [isMockMode]);

  const handleSelectUser = (user: UsuarioActual) => {
    console.log('[UserSelector] Seleccionando usuario:', user);
    setUsuarioDemo(user);
    setIsOpen(false);
  };

  // Mostrar siempre para debugging
  console.log('[UserSelector] isMockMode:', isMockMode, 'usuario:', usuario);
  
  // Temporalmente comentado para debugging
  // if (!isMockMode) {
  //   console.log('[UserSelector] No está en modo mock, ocultando selector');
  //   return null;
  // }

  // if (!usuario) {
  //   console.log('[UserSelector] No hay usuario, ocultando selector');
  //   return null;
  // }

  return (
    <div className="bg-red-100 p-2 border border-red-500">
      <p className="text-red-800 text-sm mb-2">DEBUG: UserSelector visible</p>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors text-gray-900 border border-gray-300 h-auto py-2 px-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold leading-none">{usuario?.nombre || 'No usuario'}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] leading-none ${getRolColor(usuario?.rol || 'ESTUDIANTE')} h-auto py-0.5 px-1.5 font-medium border-0`}
                >
                  {getRolLabel(usuario?.rol || 'ESTUDIANTE')}
                </Badge>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600 ml-1" />
          </Button>
        </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2">
        <DropdownMenuLabel className="flex items-center gap-2 text-gray-700 px-3 py-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">Cambiar Usuario</span>
          <Badge variant="outline" className="ml-auto text-[10px] bg-blue-50 text-blue-700 border-blue-200">
            UCT Demo
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />

        <div className="max-h-[400px] overflow-y-auto space-y-1">
          {USUARIOS_DEMO.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`cursor-pointer p-3 rounded-md transition-all ${
                usuario?.id === user.id 
                  ? "bg-blue-50 border border-blue-200" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    usuario?.id === user.id 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm" 
                      : "bg-gray-100"
                  }`}>
                    <User className={`w-5 h-5 ${
                      usuario?.id === user.id ? "text-white" : "text-gray-500"
                    }`} />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-sm truncate text-gray-900">{user.nombre}</span>
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${getRolColor(user.rol)} border-0 font-medium`}
                  >
                    {getRolLabel(user.rol)}
                  </Badge>
                  {usuario?.id === user.id && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
