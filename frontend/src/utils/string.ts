// Función para normalizar strings/valores
// Á1É2Í3Ó4Ú5 -> a1e2i3o4u5
export const normalize = (value: string | number | boolean | object): string =>
    String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
