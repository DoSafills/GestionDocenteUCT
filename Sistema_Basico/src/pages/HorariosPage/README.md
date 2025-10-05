# HorariosPage - Estructura Modular

Esta implementación sigue los principios de Clean Architecture y proporciona una estructura modular y escalable para la gestión de horarios académicos.

## Estructura de Archivos

```
HorariosPage/
├── index.tsx                          # Re-exportación del componente principal
├── HorariosPage.tsx                   # Componente principal con lógica de UI
├── types/
│   ├── index.ts                       # Exportaciones centralizadas de tipos
│   ├── horario.ts                     # Tipos específicos del dominio horario
│   ├── formulario.ts                  # Tipos de formularios y estados
│   └── componentes.ts                 # Props de componentes y interfaces UI
├── services/
│   ├── index.ts                       # Exportaciones de servicios
│   └── horarioService.ts              # Lógica de negocio y orquestación
├── repository/
│   ├── index.ts                       # Exportaciones de repositorios
│   └── horarioRepository.ts           # Acceso y transformación de datos
├── hooks/
│   ├── index.ts                       # Exportaciones de hooks
│   ├── useHorarios.ts                 # Hook principal para gestión de horarios
│   └── useFormularioHorario.ts        # Hook para formularios
├── components/
│   ├── index.ts                       # Exportaciones de componentes
│   ├── FormularioHorario.tsx          # Formulario para crear/editar horarios
│   ├── ListaHorarios.tsx              # Vista de lista de horarios
│   ├── CalendarioHorarios.tsx         # Vista de calendario semanal/mensual
│   ├── FiltrosHorarios.tsx            # Componente de filtros avanzados
│   └── EstadisticasHorarios.tsx       # Tarjetas de estadísticas
├── utils/
│   ├── index.ts                       # Exportaciones de utilidades
│   └── formatters.ts                  # Funciones de formato y transformación
└── constants/
    ├── index.ts                       # Exportaciones de constantes
    ├── configuracion.ts               # Configuraciones por defecto
    └── colores.ts                     # Constantes de colores y estilos
```

## Arquitectura por Capas

### 1. Capa de Presentación (UI)
- **HorariosPage.tsx**: Componente principal que maneja el estado de la UI
- **components/**: Componentes reutilizables específicos del módulo
- **hooks/**: Hooks personalizados para lógica de estado y efectos

### 2. Capa de Aplicación (Services)
- **services/horarioService.ts**: Orquesta la lógica de negocio
- Maneja validaciones, transformaciones y coordinación entre repositorios
- Proporciona una API limpia para la capa de presentación

### 3. Capa de Infraestructura (Repository)
- **repository/horarioRepository.ts**: Acceso y manipulación de datos
- Abstrae el origen de datos (mock, API, base de datos)
- Transforma datos entre formatos del dominio y externos

### 4. Capa de Dominio (Types)
- **types/**: Definiciones de tipos y interfaces del dominio
- Representa las entidades de negocio según el diagrama MER

## Funcionalidades Implementadas

### Consulta de Horarios
```typescript
// Por sección
const horarios = await service.obtenerHorariosPorSeccion('seccion_1');

// Por clase individual
const horario = await service.obtenerHorarioPorClase('clase_1');

// Por docente
const horariosDocente = await service.obtenerHorariosPorDocente('12345678-9');

// Por bloque horario
const horariosBloque = await service.obtenerHorariosPorBloque('1');

// Con filtros personalizados
const horariosFiltrados = await service.filtrarHorarios({
  seccionId: 'seccion_1',
  estado: 'Activo'
});
```

### Estadísticas
```typescript
const stats = await service.obtenerEstadisticas();
// Retorna: { totalClases, clasesPorEstado, clasesPorDia }
```

## Mapeo de Endpoints

Los métodos del servicio se mapean directamente a endpoints REST:

- `GET /api/seccion/{seccion_id}/horarios` → `obtenerHorariosPorSeccion()`
- `GET /api/clase/{clase_id}` → `obtenerHorarioPorClase()`
- `GET /api/bloque/{bloque_id}` → `obtenerHorariosPorBloque()`
- `GET /api/docente/{rut}/horarios` → `obtenerHorariosPorDocente()`

## Beneficios de esta Arquitectura

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Testabilidad**: Cada componente puede probarse independientemente
3. **Reutilización**: Servicios y repositorios pueden usarse en otros módulos
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar código existente
5. **Mantenibilidad**: Código organizado y fácil de localizar
6. **Tipado Fuerte**: TypeScript proporciona seguridad de tipos en tiempo de compilación

## Uso del Hook Principal

```typescript
import { useHorarios } from './hooks';

function MiComponente() {
  const {
    horarios,
    cargando,
    error,
    obtenerHorariosPorSeccion,
    filtrarHorarios
  } = useHorarios();

  // Usar las funciones según sea necesario
}
```

## Extensibilidad

Para agregar nuevas funcionalidades:

1. **Nuevos tipos**: Agregar en `types/`
2. **Nueva lógica de negocio**: Extender `horarioService.ts`
3. **Nuevas consultas de datos**: Extender `horarioRepository.ts`
4. **Nuevos componentes**: Agregar en `components/`
5. **Nuevas utilidades**: Agregar en `utils/`

Esta estructura proporciona una base sólida y escalable para el desarrollo futuro del sistema de gestión de horarios.