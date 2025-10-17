export type PisoExtractor = (codigo: string) => number | null;

export const pisoDesdeCodigo: PisoExtractor = (codigo: string) => {
  const m = String(codigo || '').match(/(\d)/);
  return m ? Number(m[1]) : null;
};
