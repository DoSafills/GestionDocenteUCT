export class ApiService<T> {
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getAll(): Promise<T[]> {
        const res = await fetch(this.endpoint);
        if (!res.ok) throw new Error('Error al obtener los datos');
        return res.json();
    }

    async getById(id: number | string): Promise<T> {
        const res = await fetch(`${this.endpoint}/${id}`);
        if (!res.ok) throw new Error(`Error al obtener el registro con id ${id}`);
        return res.json();
    }

    async create(item: Omit<T, 'id'>): Promise<T> {
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error('Error al crear el registro');
        return res.json();
    }

    async update(id: number | string, item: Partial<T>): Promise<T> {
        const res = await fetch(`${this.endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error('Error al actualizar el registro');
        return res.json();
    }

    async delete(id: number | string): Promise<void> {
        const res = await fetch(`${this.endpoint}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar el registro');
    }
}
