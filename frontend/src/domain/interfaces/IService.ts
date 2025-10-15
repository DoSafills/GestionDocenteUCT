import type { BaseEntity } from '@/domain/entities/BaseEntity';

export interface IService<T extends BaseEntity<DTO>, DTO extends { id: number }> {
    obtenerTodas(): Promise<T[]>;
    obtenerPorId(id: number): Promise<T | undefined>;
    crearNueva(data: Omit<DTO, 'id'>): Promise<T>;
    actualizar(id: number, data: Partial<Omit<DTO, 'id'>>): Promise<T>;
    eliminar(id: number): Promise<void>;
}
