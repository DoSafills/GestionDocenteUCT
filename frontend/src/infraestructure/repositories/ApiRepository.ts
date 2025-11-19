import axios from 'axios';
import { getAccessToken } from '@/auth/tokenStore';
import type { IRepository } from '@/domain/repositories/IRepository';

export class ApiRepository<T extends { id: number }> implements IRepository<T> {
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

    private async handleResponse<R>(res: any): Promise<R> {
        if (res.status !== 200) throw new Error(`Error ${res.status}: ${res.statusText}`);

        return res.data;
    }

    async getAll(forceRefresh = false): Promise<T[]> {
        if (!forceRefresh && this.cache.length > 0) {
            return structuredClone(this.cache);
        }

        const res = await axios.get(this.endpoint, { headers: this.getHeaders() });

        const data = await this.handleResponse<T[]>(res);

        this.cache = data;

        return structuredClone(data);
    }

    async getById(id: number): Promise<T> {
        const found = this.cache.find((x) => x.id === id);

        if (found) return structuredClone(found);

        const res = await axios.get(`${this.endpoint}/${id}`, { headers: this.getHeaders() });
        const data = await this.handleResponse<T>(res);

        this.cache.unshift(data);

        return structuredClone(data);
    }

    async create(item: Omit<T, 'id'>): Promise<T> {
        const res = await axios.post(this.endpoint, item, { headers: this.getHeaders() });

        const data = await this.handleResponse<T>(res);

        this.cache.unshift(data);

        return structuredClone(data);
    }

    async update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T> {
        const res = await axios.put(`${this.endpoint}/${id}`, item, { headers: this.getHeaders() });

        const updated = await this.handleResponse<T>(res);

        const index = this.cache.findIndex((x) => x.id === updated.id);

        if (index !== -1) this.cache[index] = updated;
        else this.cache.push(updated);

        return structuredClone(updated);
    }

    async delete(id: number): Promise<void> {
        const res = await axios.delete(`${this.endpoint}/${id}`, { headers: this.getHeaders() });

        await this.handleResponse(res);

        const index = this.cache.findIndex((x) => x.id === id);

        if (index !== -1) this.cache.splice(index, 1);
    }
}
