import type { BaseEntity } from '@/domain/entities/BaseEntity';
import type { IService } from '@/domain/interfaces/IService';
import type { IRepository } from '@/domain/repositories/IRepository';

export abstract class BaseService<T extends BaseEntity<DTO>, DTO extends { id: number }> implements IService<T, DTO> {
    protected readonly repository: IRepository<DTO>;
    protected readonly mapToEntity: (dto: DTO) => T;

    constructor(repository: IRepository<DTO>, mapToEntity: (dto: DTO) => T) {
        this.repository = repository;
        this.mapToEntity = mapToEntity;
    }

    async obtenerTodas(): Promise<T[]> {
        const dtos = await this.repository.getAll();
        return dtos.map(this.mapToEntity);
    }

    async obtenerPorId(id: number): Promise<T | undefined> {
        const dto = await this.repository.getById(id);
        return dto ? this.mapToEntity(dto) : undefined;
    }

    async crearNueva(data: Omit<DTO, 'id'>): Promise<T> {
        const dto = await this.repository.create(data);

        return this.mapToEntity(dto);
    }

    async actualizar(id: number, data: Partial<Omit<DTO, 'id'>>): Promise<T> {
        const dto = await this.repository.update(id, data);
        return this.mapToEntity(dto);
    }

    async eliminar(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async filtrarPor(filtro: (dto: DTO) => boolean): Promise<T[]> {
        const dtos = await this.repository.getAll();

        return dtos.filter(filtro).map(this.mapToEntity);
    }
}
