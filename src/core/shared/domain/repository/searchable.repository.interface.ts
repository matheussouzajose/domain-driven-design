import { Entity } from '@core/shared/domain/entity/entity';
import { ValueObject } from '@core/shared/domain/value-object/value-object';
import { SearchParams } from '@core/shared/domain/value-object/search-params.vo';
import { SearchResult } from '@core/shared/domain/value-object/search-result.vo';
import { IRepository } from '@core/shared/domain/repository/repository.interface';

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
