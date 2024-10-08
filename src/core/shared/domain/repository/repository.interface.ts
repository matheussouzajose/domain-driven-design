import { Entity } from '@core/shared/domain/entity/entity';
import { ValueObject } from '@core/shared/domain/value-object/value-object';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entityId: EntityId): Promise<void>;
  findById(entityId: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
  bulkInsert(entities: E[]): Promise<void>;
  findByIds(ids: EntityId[]): Promise<E[]>;
  existsById(ids: EntityId[]): Promise<{
    exists: EntityId[];
    not_exists: EntityId[];
  }>;

  getEntity(): new (...args: any[]) => E;
}
