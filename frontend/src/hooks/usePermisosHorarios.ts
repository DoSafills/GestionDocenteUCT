import { useState, useEffect } from "react";
import { authService, type UsuarioActual, type Rol } from "@/application/services/AuthService";

export interface PermisosHorarios {
  puedeVerTodos: boolean;
  puedeVerPropios: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeFiltrarPorDocente: boolean;
  puedeFiltrarPorEstudiante: boolean;
  puedeExportar: boolean;
}

const obtenerPermisosPorRol = (rol: Rol | null): PermisosHorarios => {
  switch (rol) {
    case "ADMINISTRADOR":
      return {
        puedeVerTodos: true,
        puedeVerPropios: true,
        puedeCrear: true,
        puedeEditar: true,
        puedeEliminar: true,
        puedeFiltrarPorDocente: true,
        puedeFiltrarPorEstudiante: true,
        puedeExportar: true,
      };

    case "DOCENTE":
      return {
        puedeVerTodos: false,
        puedeVerPropios: true,
        puedeCrear: false,
        puedeEditar: false,
        puedeEliminar: false,
        puedeFiltrarPorDocente: false,
        puedeFiltrarPorEstudiante: false,
        puedeExportar: true,
      };

    case "ESTUDIANTE":
      return {
        puedeVerTodos: false,
        puedeVerPropios: true,
        puedeCrear: false,
        puedeEditar: false,
        puedeEliminar: false,
        puedeFiltrarPorDocente: false,
        puedeFiltrarPorEstudiante: false,
        puedeExportar: true,
      };

    default:
      return {
        puedeVerTodos: false,
        puedeVerPropios: false,
        puedeCrear: false,
        puedeEditar: false,
        puedeEliminar: false,
        puedeFiltrarPorDocente: false,
        puedeFiltrarPorEstudiante: false,
        puedeExportar: false,
      };
  }
};

/**
 * Hook para obtener los permisos del usuario autenticado en horarios
 * Se suscribe a cambios en el usuario del AuthService
 */
export const usePermisosHorarios = () => {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(authService.getUsuarioActual());
  const [permisos, setPermisos] = useState<PermisosHorarios>(
    obtenerPermisosPorRol(authService.getRol())
  );

  useEffect(() => {
    console.log('[usePermisosHorarios] Hook inicializado');
    // Suscribirse a cambios del usuario
    const unsub = authService.onChange((user) => {
      console.log('[usePermisosHorarios] Usuario cambiado:', user);
      setUsuario(user);
      setPermisos(obtenerPermisosPorRol(user?.rol ?? null));
    });

    // Intentar cargar usuario desde API solo si hay token
    // Si no hay token, el usuario se establecerá manualmente (demo mode)
    const cargarUsuario = async () => {
      console.log('[usePermisosHorarios] Cargando usuario desde API...');
      const user = await authService.cargarUsuarioDesdeApi();
      console.log('[usePermisosHorarios] Usuario cargado:', user);
      if (user) {
        setUsuario(user);
        setPermisos(obtenerPermisosPorRol(user.rol));
      }
    };

    if (!usuario) {
      cargarUsuario();
    }

    return unsub;
  }, []);

  const rol = usuario?.rol ?? null;

  return {
    permisos,
    usuario,
    rol,
    cargando: false, // El AuthService maneja el estado internamente
    esDocente: rol === "DOCENTE",
    esEstudiante: rol === "ESTUDIANTE",
    esAdministrador: rol === "ADMINISTRADOR",
  };
};
