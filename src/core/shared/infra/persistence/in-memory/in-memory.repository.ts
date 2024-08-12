import { ValueObject } from '@core/shared/domain/value-object/value-object';
import { IRepository } from '@core/shared/domain/repository/repository.interface';
import { Entity } from '@core/shared/domain/entity/entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidArgumentError } from '@core/shared/domain/errors/invalid-argument.error';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.items[indexFound] = entity;
  }

  async delete(entityId: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entityId),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entityId, this.getEntity());
    }
    this.items.splice(indexFound, 1);
  }

  async findById(entityId: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entity_id.equals(entityId));
    return typeof item === 'undefined' ? null : item;
  }

  async findAll(): Promise<any[]> {
    return this.items;
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async existsById(
    ids: EntityId[],
  ): Promise<{ exists: EntityId[]; not_exists: EntityId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }
    if (this.items.length === 0) {
      return {
        exists: [],
        not_exists: ids,
      };
    }
    const existsId = new Set<EntityId>();
    const notExistsId = new Set<EntityId>();
    ids.forEach((id) => {
      const item = this.items.find((entity) => entity.entity_id.equals(id));
      item ? existsId.add(id) : notExistsId.add(id);
    });
    return {
      exists: Array.from(existsId.values()),
      not_exists: Array.from(notExistsId.values()),
    };
  }

  abstract getEntity(): new (...args: any[]) => E;

  findByIds(ids: EntityId[]): Promise<E[]> {
    return Promise.resolve([]);
  }
}
