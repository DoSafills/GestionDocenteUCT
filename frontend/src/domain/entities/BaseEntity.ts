export abstract class BaseEntity<T> {
    protected data: T;

    constructor(dto: T) {
        this.data = dto;
    }

    toDTO(): T {
        return { ...this.data };
    }
}
