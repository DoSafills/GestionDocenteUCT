import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Users, Building, BookOpen, Settings, TrendingUp, MapPin } from 'lucide-react';

const profesoresMock = [
    {
        id: 'prof_1',
        nombre: 'Carlos',
        apellido: 'Rodriguez',
        email: 'carlos.rodriguez@universidad.edu',
        telefono: '+56912345678',
        especialidad: ['Matemáticas', 'Estadística', 'Álgebra Lineal'],
        disponibilidad: {
            dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves'],
            horasInicio: '08:00',
            horasFin: '18:00',
        },
        experiencia: 15,
        estado: 'activo',
        fechaContratacion: '2010-03-15',
    },
    {
        id: 'prof_2',
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@universidad.edu',
        telefono: '+56923456789',
        especialidad: ['Programación', 'Algoritmos', 'Estructura de Datos'],
        disponibilidad: {
            dias: ['Lunes', 'Miércoles', 'Viernes'],
            horasInicio: '09:00',
            horasFin: '17:00',
        },
        experiencia: 8,
        estado: 'activo',
        fechaContratacion: '2016-08-20',
    },
    {
        id: 'prof_3',
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@universidad.edu',
        telefono: '+56934567890',
        especialidad: ['Física', 'Mecánica', 'Termodinámica'],
        disponibilidad: {
            dias: ['Martes', 'Jueves', 'Viernes'],
            horasInicio: '08:30',
            horasFin: '16:30',
        },
        experiencia: 12,
        estado: 'activo',
        fechaContratacion: '2012-01-10',
    },
    {
        id: 'prof_4',
        nombre: 'Roberto',
        apellido: 'Silva',
        email: 'roberto.silva@universidad.edu',
        telefono: '+56945678901',
        especialidad: ['Química', 'Química Orgánica', 'Laboratorio'],
        disponibilidad: {
            dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
            horasInicio: '07:00',
            horasFin: '15:00',
        },
        experiencia: 20,
        estado: 'activo',
        fechaContratacion: '2004-09-05',
    },
];

const edificiosMock = [
    {
        id: 'edif_1',
        nombre: 'Edificio de Ciencias',
        codigo: 'CS',
        direccion: 'Av. Universidad 123',
        salas: [
            {
                id: 'sala_cs_101',
                numero: 'CS-101',
                edificioId: 'edif_1',
                capacidad: 40,
                tipo: 'aula',
                equipamiento: ['Proyector', 'Pizarra', 'Sistema de audio'],
                disponible: true,
                horarios: [],
            },
            {
                id: 'sala_cs_102',
                numero: 'CS-102',
                edificioId: 'edif_1',
                capacidad: 30,
                tipo: 'laboratorio',
                equipamiento: ['Computadores', 'Proyector', 'Pizarra digital'],
                disponible: true,
                horarios: [],
            },
            {
                id: 'sala_cs_201',
                numero: 'CS-201',
                edificioId: 'edif_1',
                capacidad: 60,
                tipo: 'auditorio',
                equipamiento: ['Sistema de sonido', 'Proyector HD', 'Escenario'],
                disponible: true,
                horarios: [],
            },
        ],
    },
    {
        id: 'edif_2',
        nombre: 'Edificio de Ingeniería',
        codigo: 'ING',
        direccion: 'Av. Tecnología 456',
        salas: [
            {
                id: 'sala_ing_101',
                numero: 'ING-101',
                edificioId: 'edif_2',
                capacidad: 45,
                tipo: 'aula',
                equipamiento: ['Proyector', 'Pizarra', 'Aire acondicionado'],
                disponible: true,
                horarios: [],
            },
            {
                id: 'sala_ing_lab1',
                numero: 'ING-LAB1',
                edificioId: 'edif_2',
                capacidad: 25,
                tipo: 'sala_computacion',
                equipamiento: ['30 Computadores', 'Proyector', 'Software especializado'],
                disponible: true,
                horarios: [],
            },
        ],
    },
    {
        id: 'edif_3',
        nombre: 'Edificio Central',
        codigo: 'CC',
        direccion: 'Plaza Central s/n',
        salas: [
            {
                id: 'sala_cc_aula1',
                numero: 'CC-AULA1',
                edificioId: 'edif_3',
                capacidad: 80,
                tipo: 'aula',
                equipamiento: ['Proyector', 'Sistema de audio', 'Pizarra'],
                disponible: true,
                horarios: [],
            },
        ],
    },
];

const asignaturasMock = [
    {
        id: 'asig_1',
        codigo: 'MAT1105-07',
        nombre: 'Cálculo I',
        creditos: 6,
        semestre: 1,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_1',
        salaId: 'sala_cs_101',
        horarios: [
            { dia: 'Lunes', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Miércoles', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Viernes', horaInicio: '08:30', horaFin: '10:00' },
        ],
        prerrequisitos: [],
        cupos: 40,
        inscritos: 35,
        estado: 'programada',
        descripcion: 'Introducción al cálculo diferencial e integral',
    },
    {
        id: 'asig_2',
        codigo: 'INF1101-02',
        nombre: 'Introducción a la Programación',
        creditos: 6,
        semestre: 1,
        carrera: 'Ingeniería en Informática',
        profesorId: 'prof_2',
        salaId: 'sala_ing_lab1',
        horarios: [
            { dia: 'Martes', horaInicio: '10:15', horaFin: '12:30' },
            { dia: 'Jueves', horaInicio: '10:15', horaFin: '12:30' },
        ],
        prerrequisitos: [],
        cupos: 25,
        inscritos: 23,
        estado: 'programada',
        descripcion: 'Fundamentos de programación en Python',
    },
    {
        id: 'asig_3',
        codigo: 'FIS1201-01',
        nombre: 'Física General I',
        creditos: 6,
        semestre: 2,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_3',
        salaId: 'sala_cs_102',
        horarios: [
            { dia: 'Lunes', horaInicio: '14:00', horaFin: '15:30' },
            { dia: 'Miércoles', horaInicio: '14:00', horaFin: '15:30' },
        ],
        prerrequisitos: ['MAT1105-07'],
        cupos: 30,
        inscritos: 28,
        estado: 'programada',
        descripcion: 'Mecánica clásica y ondas',
    },
    {
        id: 'asig_4',
        codigo: 'QUI1201-03',
        nombre: 'Química General',
        creditos: 4,
        semestre: 1,
        carrera: 'Ingeniería Química',
        profesorId: 'prof_4',
        salaId: 'sala_cs_102',
        horarios: [
            { dia: 'Martes', horaInicio: '08:30', horaFin: '10:00' },
            { dia: 'Jueves', horaInicio: '08:30', horaFin: '10:00' },
        ],
        prerrequisitos: [],
        cupos: 30,
        inscritos: 25,
        estado: 'programada',
        descripcion: 'Fundamentos de química general y laboratorio',
    },
    {
        id: 'asig_5',
        codigo: 'MAT2205-01',
        nombre: 'Cálculo II',
        creditos: 6,
        semestre: 2,
        carrera: 'Ingeniería Civil',
        profesorId: 'prof_1',
        horarios: [
            { dia: 'Martes', horaInicio: '14:00', horaFin: '15:30' },
            { dia: 'Jueves', horaInicio: '14:00', horaFin: '15:30' },
        ],
        prerrequisitos: ['MAT1105-07'],
        cupos: 35,
        inscritos: 0,
        estado: 'planificada',
        descripcion: 'Cálculo multivariable y ecuaciones diferenciales',
    },
];

const restriccionesMock = [
    {
        id: 'rest_1',
        tipo: 'prerrequisito',
        descripcion: 'Cálculo I es prerrequisito obligatorio para Física General I',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            asignaturaDestino: 'FIS1201-01',
        },
        mensaje: 'El estudiante debe haber aprobado Cálculo I antes de inscribir Física General I',
        fechaCreacion: '2024-01-15',
        creadoPor: 'admin',
    },
    {
        id: 'rest_2',
        tipo: 'sala_prohibida',
        descripcion: 'Química General no puede dictarse en salas de computación',
        activa: true,
        prioridad: 'media',
        parametros: {
            asignaturaOrigen: 'QUI1201-03',
            salaProhibida: 'sala_computacion',
        },
        mensaje: 'Las clases de Química requieren laboratorio especializado, no salas de computación',
        fechaCreacion: '2024-01-10',
        creadoPor: 'admin',
    },
    {
        id: 'rest_3',
        tipo: 'horario_conflicto',
        descripcion: 'No se pueden programar clases de laboratorio después de las 16:00',
        activa: true,
        prioridad: 'media',
        parametros: {
            diaRestriccion: 'todos',
            horaInicioRestriccion: '16:00',
            horaFinRestriccion: '23:59',
        },
        mensaje: 'Los laboratorios deben programarse antes de las 16:00 por seguridad',
        fechaCreacion: '2024-01-05',
        creadoPor: 'admin',
    },
    {
        id: 'rest_4',
        tipo: 'profesor_especialidad',
        descripcion: 'Solo profesores con especialidad en Matemáticas pueden dictar Cálculo',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            especialidadRequerida: 'Matemáticas',
        },
        mensaje: 'El profesor debe tener especialidad en Matemáticas para dictar materias de cálculo',
        fechaCreacion: '2024-01-12',
        creadoPor: 'admin',
    },
    {
        id: 'rest_5',
        tipo: 'secuencia_temporal',
        descripcion: 'Cálculo II solo puede ofrecerse después de Cálculo I',
        activa: true,
        prioridad: 'alta',
        parametros: {
            asignaturaOrigen: 'MAT1105-07',
            asignaturaDestino: 'MAT2205-01',
        },
        mensaje: 'Cálculo II es una continuación directa de Cálculo I',
        fechaCreacion: '2024-01-08',
        creadoPor: 'admin',
    },
];

export function DashboardPage() {
    // Estadísticas generales
    const totalProfesores = profesoresMock.length;
    const profesoresActivos = profesoresMock.filter((p) => p.estado === 'activo').length;
    const totalSalas = edificiosMock.reduce((acc, edificio) => acc + edificio.salas.length, 0);
    const salasDisponibles = edificiosMock.reduce(
        (acc, edificio) => acc + edificio.salas.filter((s) => s.disponible).length,
        0,
    );
    const totalAsignaturas = asignaturasMock.length;
    const asignaturasProgramadas = asignaturasMock.filter((a) => a.estado === 'programada').length;
    const restriccionesActivas = restriccionesMock.filter((r) => r.activa).length;

    // Estadísticas por carrera
    const asignaturasPorCarrera = asignaturasMock.reduce(
        (acc, asig) => {
            acc[asig.carrera] = (acc[asig.carrera] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    // Utilización de salas por edificio
    const utilizacionSalas = edificiosMock.map((edificio) => {
        const salasConAsignatura = edificio.salas.filter((sala) =>
            asignaturasMock.some((asig) => asig.salaId === sala.id),
        ).length;
        const porcentajeUso = edificio.salas.length > 0 ? (salasConAsignatura / edificio.salas.length) * 100 : 0;

        return {
            edificio: edificio.nombre,
            codigo: edificio.codigo,
            totalSalas: edificio.salas.length,
            salasEnUso: salasConAsignatura,
            porcentajeUso,
        };
    });

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h2 className='text-3xl'>Dashboard</h2>
                <p className='text-muted-foreground'>Resumen general del sistema</p>
            </div>

            {/* Métricas principales */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {/* Profesores */}
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm'>Profesores</CardTitle>
                        <Users className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {profesoresActivos}/{totalProfesores}
                        </div>
                        <p className='text-xs text-muted-foreground'>Activos de {totalProfesores} totales</p>
                        <Progress value={(profesoresActivos / totalProfesores) * 100} className='mt-2' />
                    </CardContent>
                </Card>

                {/* Salas */}
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm'>Salas</CardTitle>
                        <Building className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {salasDisponibles}/{totalSalas}
                        </div>
                        <p className='text-xs text-muted-foreground'>Disponibles de {totalSalas} totales</p>
                        <Progress value={(salasDisponibles / totalSalas) * 100} className='mt-2' />
                    </CardContent>
                </Card>

                {/* Asignaturas */}
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm'>Asignaturas</CardTitle>
                        <BookOpen className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {asignaturasProgramadas}/{totalAsignaturas}
                        </div>
                        <p className='text-xs text-muted-foreground'>Programadas de {totalAsignaturas} totales</p>
                        <Progress value={(asignaturasProgramadas / totalAsignaturas) * 100} className='mt-2' />
                    </CardContent>
                </Card>

                {/* Restricciones */}
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm'>Restricciones</CardTitle>
                        <Settings className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{restriccionesActivas}</div>
                        <p className='text-xs text-muted-foreground'>Restricciones activas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Fila principal — amplia */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Asignaturas por Carrera */}
                <Card className='lg:col-span-1'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <TrendingUp className='h-5 w-5' />
                            Asignaturas por Carrera
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {Object.entries(asignaturasPorCarrera).map(([carrera, cantidad]) => (
                                <div key={carrera} className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-sm font-medium'>{carrera}</span>
                                        <span className='text-sm text-muted-foreground'>{cantidad} asignaturas</span>
                                    </div>
                                    <Progress value={(cantidad / totalAsignaturas) * 100} className='h-2' />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Últimas Restricciones Agregadas — ahora más amplia */}
                <Card className='lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Settings className='h-5 w-5' />
                            Últimas Restricciones Agregadas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3 max-h-80 overflow-y-auto'>
                            {restriccionesMock
                                .slice()
                                .sort(
                                    (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
                                )
                                .map((r) => (
                                    <div
                                        key={r.id}
                                        className='flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors'
                                    >
                                        <div className='mt-0.5'>
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    r.prioridad === 'alta'
                                                        ? 'bg-red-500'
                                                        : r.prioridad === 'media'
                                                          ? 'bg-yellow-500'
                                                          : 'bg-blue-500'
                                                }`}
                                            ></div>
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium'>{r.tipo}</p>
                                            <p className='text-xs text-muted-foreground'>{r.descripcion}</p>
                                        </div>
                                        <Badge variant='outline' className='text-xs capitalize'>
                                            {r.prioridad}
                                        </Badge>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Segunda fila */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Utilización de edificios */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Building className='h-5 w-5' />
                            Utilización de Edificios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {utilizacionSalas.map((edificio) => (
                                <div key={edificio.codigo} className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <MapPin className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-sm font-medium'>{edificio.edificio}</span>
                                            <Badge variant='outline' className='text-xs'>
                                                {edificio.codigo}
                                            </Badge>
                                        </div>
                                        <span className='text-sm text-muted-foreground'>
                                            {edificio.salasEnUso}/{edificio.totalSalas} salas
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Progress value={edificio.porcentajeUso} className='flex-1 h-2' />
                                        <span className='text-xs text-muted-foreground w-12'>
                                            {Math.round(edificio.porcentajeUso)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
