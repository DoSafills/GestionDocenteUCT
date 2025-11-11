export interface IRepository<T extends { id: number }> {
    getAll(forceRefresh?: boolean): Promise<T[]>;
    getById(id: number): Promise<T>;
    create(item: Omit<T, 'id'>): Promise<T>;
    update(id: number, item: Partial<Omit<T, 'id'>>): Promise<T>;
    delete(id: number): Promise<void>;
}
