import { ISearchableRepository } from '@core/shared/domain/repository/searchable.repository.interface';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { SearchResult } from '@core/shared/domain/value-object/search-result.vo';
import { SearchParams } from '@core/shared/domain/value-object/search-params.vo';

export type ProductFilter = string;

export class ProductSearchParams extends SearchParams<ProductFilter> {}

export class ProductSearchResult extends SearchResult<Product> {}

export interface IProductRepository
  extends ISearchableRepository<
    Product,
    ProductId,
    ProductFilter,
    ProductSearchParams,
    ProductSearchResult
  > {}
