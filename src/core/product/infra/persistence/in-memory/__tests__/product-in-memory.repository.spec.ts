import { ProductInMemoryRepository } from '@core/product/infra/persistence/in-memory/product-in-memory.repository';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidArgumentError } from '@core/shared/domain/errors/invalid-argument.error';

describe('ProductInMemoryRepository Unit Tests', () => {
  let repository: ProductInMemoryRepository;

  beforeEach(() => (repository = new ProductInMemoryRepository()));

  test('Should be insert product', async () => {
    const product = Product.fake().aProduct().build();
    await repository.insert(product);
    expect(repository.items).toHaveLength(1);
  });

  test('Should throw error when product not found to update', async () => {
    const product = Product.fake().aProduct().build();
    await expect(repository.update(product)).rejects.toThrow(NotFoundError);
  });

  test('Should be update product', async () => {
    const product = Product.fake().aProduct().build();
    await repository.insert(product);

    product.changeName('Product');
    await repository.update(product);
    expect(repository.items[0].getName()).toBe('Product');
  });

  test('Should return null when product not found to find by', async () => {
    const product = await repository.findById(new ProductId());
    expect(product).toBeNull();
  });

  test('Should return product when found', async () => {
    const product = Product.fake().aProduct().build();
    await repository.insert(product);
    const productFound = await repository.findById(product.entity_id);
    expect(productFound).toEqual(product);
  });

  test('Should return all products', async () => {
    const products = Product.fake().aProducts(5).build();
    await repository.bulkInsert(products);
    const productsFound = await repository.findAll();
    expect(productsFound).toHaveLength(5);
  });

  test('Should insert many products', async () => {
    const products = Product.fake().aProducts(5).build();
    await repository.bulkInsert(products);
    expect(repository.items).toHaveLength(5);
  });

  test('Should throw error when given empty ids', async () => {
    await expect(repository.existsById([])).rejects.toThrowError(
      InvalidArgumentError,
    );
  });

  test('Should return empty ids when items is empty', async () => {
    const { exists, not_exists } = await repository.existsById([
      new ProductId(),
      new ProductId(),
    ]);
    expect(exists).toHaveLength(0);
    expect(not_exists).toHaveLength(2);
  });

  test('Should return ids when given valid ids', async () => {
    const products = Product.fake().aProducts(4).build();
    await repository.bulkInsert(products);
    const exists = products.map((item) => item.entity_id);
    const ids = [...exists, new ProductId()];
    const { exists: existsFound, not_exists: notExistsFound } =
      await repository.existsById(ids);
    expect(existsFound).toHaveLength(4);
    expect(notExistsFound).toHaveLength(1);
  });

  test('should no filter items when filter object is null', async () => {
    const items = [
      Product.fake().aProduct().build(),
      Product.fake().aProduct().build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  test('should filter items by name', async () => {
    const faker = Product.fake().aProduct();
    const items = [
      faker.withName('test').build(),
      faker.withName('TEST').build(),
      faker.withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  test('should sort by name', async () => {
    const items = [
      Product.fake().aProduct().withName('c').build(),
      Product.fake().aProduct().withName('b').build(),
      Product.fake().aProduct().withName('a').build(),
    ];

    let itemsSorted = repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
