
import type { IRepository } from '@/domain/repositories/IRepository';


export class MockRepository<T extends { id: number }> implements IRepository<T> {
    protected data: T[];

    constructor(initialData: T[]) {
        this.data = [...initialData];
    }

    async getAll(): Promise<T[]> {
        return structuredClone(this.data);
    }

    async getById(id: number): Promise<T> {
        const found = this.data.find((item) => item.id === id);

        if (!found) throw new Error(`Item con id ${id} no encontrado`);

        return structuredClone(found);
    }

    async create(item: Omit<T, 'id'>): Promise<T> {
        const newItem = { ...item, id: this.data.length + 1 } as T;
        this.data.push(newItem);
        return structuredClone(newItem);
    }

    async update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
        const index = this.data.findIndex((d) => d.id === id);

        if (index === -1) throw new Error(`Item con id ${id} no encontrado`);

        this.data[index] = { ...this.data[index], ...item };
        return structuredClone(this.data[index]);
    }

    async delete(id: number): Promise<void> {
        const index = this.data.findIndex((d) => d.id === id);
        if (index === -1) throw new Error(`Item con id ${id} no encontrado`);

        this.data.splice(index, 1);
    }
}
