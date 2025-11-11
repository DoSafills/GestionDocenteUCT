export abstract class BaseEntity<T extends { id: number }> {
    protected readonly data: T;

    constructor(dto: T) {
        this.data = dto;
    }

    get id(): number {
        return this.data.id;
    }

    toDTO(): T {
        return { ...this.data };
    }
}
