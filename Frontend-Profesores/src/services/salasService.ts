export const edificios = [
  {
    id: "CS",
    nombre: "Edificio de Ciencias",
    direccion: "Av. Universidad 123",
    salas: [
      {
        id: "CS-101",
        tipo: "aula",
        estado: "Disponible",
        capacidad: 40,
        equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
        asignaturas: [
          { codigo: "MAT1105-07", nombre: "Cálculo I", horario: "Lun/Mié/Vie 08:30-10:00" }
        ]
      },
      {
        id: "CS-102",
        tipo: "laboratorio",
        estado: "Disponible",
        capacidad: 30,
        equipamiento: ["Computadores", "Proyector", "Pizarra digital"],
        asignaturas: [
          { codigo: "FIS1201-01", nombre: "Física General I", horario: "Lun/Mié 14:00-15:30" },
          { codigo: "QUI2107-03", nombre: "Química General", horario: "Mar/Jue 08:30-10:00" }
        ]
      }
    ]
  }
];
