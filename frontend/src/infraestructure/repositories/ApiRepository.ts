import { getAccessToken } from '@/auth/tokenStore';

/*
Clase que mantiene un array interno de objetos inmutables
los datos no pueden modificarse directamente desde fuera
sino unicamente a traves de los metodos del servicio.
*/

/*
Uso

export interface EdificioDTO {
    id: number,
    nombre: string,
    ...
}

export class EdificioApiRepository extends ApiRepository<EdificioDTO> {
    constructor(){
        super(ENDPOINTS.EDIFICIOS)
    }
}


Exportar singletons

export const edificioApiRepository = new EdificioApiRepository()

*/

export class ApiRepository<T extends { id: number }> {
    protected endpoint: string;
    private cache: T[];

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.cache = [];
    }

    protected getHeaders() {
        return {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
        };
    }

    private async handleResponse<R>(res: Response): Promise<R> {
        if (!res.ok) throw new Error(`Error ${res.status}: ${(await res.text()) || res.statusText}`);

        return res.json();
    }

    async getAll(forceRefresh = false): Promise<T[]> {
        if (!forceRefresh && this.cache.length > 0) {
            return structuredClone(this.cache);
        }

        const res = await fetch(this.endpoint, { headers: this.getHeaders() });

        const data = await this.handleResponse<T[]>(res);

        this.cache = data;

        return structuredClone(data);
    }

    async getById(id: number): Promise<T> {
        const found = this.cache.find((x) => x.id === id);

        if (found) return structuredClone(found);

        const res = await fetch(`${this.endpoint}/${id}`, { headers: this.getHeaders() });
        const data = await this.handleResponse<T>(res);

        this.cache.unshift(data);

        return structuredClone(data);
    }

    async create(item: Omit<T, 'id'>): Promise<T> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        const data = await this.handleResponse<T>(res);

        this.cache.unshift(data);

        return structuredClone(data);
    }

    async update(id: string | number, item: Partial<Omit<T, 'id'>>): Promise<T> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(item),
        });

        const updated = await this.handleResponse<T>(res);

        const index = this.cache.findIndex((x) => x.id === updated.id);

        if (index !== -1) this.cache[index] = updated;
        else this.cache.push(updated);

        return structuredClone(updated);
    }

    async delete(id: string | number): Promise<void> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        this.handleResponse(res);

        const index = this.cache.findIndex((x) => x.id === id);

        if (index !== -1) this.cache.splice(index, 1);
    }
}
