import { InMemorySearchableRepository } from '@core/shared/infra/persistence/in-memory/in-memory-searchable.repository';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import {
  IProductRepository,
  ProductFilter,
} from '@core/product/domain/repository/product.repository.interface';

export class ProductInMemoryRepository
  extends InMemorySearchableRepository<Product, ProductId>
  implements IProductRepository
{
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: Product[],
    filter: ProductFilter | null,
  ): Promise<Product[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) => {
      return item.getName().toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...args: any[]) => Product {
    return Product;
  }
}
