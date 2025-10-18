import { ApiRepository } from './ApiRepository';
import type { RestriccionAcademica } from '@/domain/entities/restriccionespage/RestriccionAcademica';

export class RestriccionRepository extends ApiRepository<RestriccionAcademica> {
    constructor() {
        // Endpoint base de la API de restricciones
        super('https://sgh.inf.uct.cl/api/restricciones');
    }

    /**
     * Actualización parcial de una restricción (PATCH)
     */
    async patch(id: number, item: Partial<Omit<RestriccionAcademica, 'id'>>): Promise<RestriccionAcademica> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        const updated = await this.handleResponse<RestriccionAcademica>(res);

        // Actualizamos la caché local
        const index = this.cache.findIndex(x => x.id === updated.id);
        if (index !== -1) this.cache[index] = updated;
        else this.cache.unshift(updated);

        return structuredClone(updated);
    }

    /**
     * Obtener restricciones filtradas por tipo
     */
    async getByTipo(tipo: string, forceRefresh = false): Promise<RestriccionAcademica[]> {
        const all = await this.getAll(forceRefresh);
        return all.filter(r => r.tipo === tipo);
    }

    /**
     * Sobrescribimos create para asegurar que los booleanos y prioridad se envían correctamente
     */
    async create(item: Omit<RestriccionAcademica, 'id'>): Promise<RestriccionAcademica> {
        // Aseguramos que los booleanos y prioridad estén definidos
        const body = {
            tipo: item.tipo,
            valor: item.valor,
            prioridad: item.prioridad ?? 1,
            restriccion_blanda: item.restriccion_blanda ?? false,
            restriccion_dura: item.restriccion_dura ?? false,
        };

        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });

        const data = await this.handleResponse<RestriccionAcademica>(res);

        this.cache.unshift(data);

        return structuredClone(data);
    }

    /**
     * Sobrescribimos update para asegurar consistencia de campos
     */
    async update(id: number, item: Partial<Omit<RestriccionAcademica, 'id'>>): Promise<RestriccionAcademica> {
        const body = {
            ...item,
            prioridad: item.prioridad ?? 1,
            restriccion_blanda: item.restriccion_blanda ?? false,
            restriccion_dura: item.restriccion_dura ?? false,
        };

        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });

        const updated = await this.handleResponse<RestriccionAcademica>(res);

        const index = this.cache.findIndex(x => x.id === updated.id);
        if (index !== -1) this.cache[index] = updated;
        else this.cache.push(updated);

        return structuredClone(updated);
    }
}
