import { ProductSequelizeRepository } from '@core/product/infra/persistence/sequelize/product-sequelize.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { ProductModelMapper } from '@core/product/infra/persistence/sequelize/product-model.mapper';
import {
  ProductSearchParams,
  ProductSearchResult,
} from '@core/product/domain/repository/product.repository.interface';
import { UnitOfWorkSequelize } from '@core/shared/infra/persistence/sequelize/unit-of-work-sequelize';

describe('ProductSequelizeRepository Integration Test', () => {
  let repository: ProductSequelizeRepository;
  let uow: UnitOfWorkSequelize;

  const sequelizeHelper = setupSequelize({ models: [ProductModel] });

  beforeEach(async () => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    repository = new ProductSequelizeRepository(ProductModel, uow);
  });

  test('should inserts a new entity', async () => {
    const product = Product.fake().aProduct().build();
    await repository.insert(product);
    const productCreated = await repository.findById(product.product_id);
    expect(productCreated!.toJSON()).toStrictEqual(product.toJSON());
  });

  test('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new ProductId());
    expect(entityFound).toBeNull();

    const entity = Product.fake().aProduct().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.product_id);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  test('should return all products', async () => {
    const entity = Product.fake().aProduct().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  test('should throw error on update when a entity not found', async () => {
    const entity = Product.fake().aProduct().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.product_id.id, Product),
    );
  });

  test('should update a entity', async () => {
    const entity = Product.fake().aProduct().build();
    await repository.insert(entity);

    entity.changeName('Product updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.product_id);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  test('should throw error on delete when a entity not found', async () => {
    const productId = new ProductId();
    await expect(repository.delete(productId)).rejects.toThrow(
      new NotFoundError(productId.id, Product),
    );
  });

  test('should delete a entity', async () => {
    const entity = Product.create({ name: 'Movie', price: 100 });
    await repository.insert(entity);

    await repository.delete(entity.product_id);
    await expect(repository.findById(entity.product_id)).resolves.toBeNull();
  });

  describe('search method tests', () => {
    test('should only apply paginate when other params are null', async () => {
      const products = Product.fake()
        .aProducts(16)
        .withName('Product')
        .withPrice(100)
        .build();
      await repository.bulkInsert(products);
      const spyToEntity = jest.spyOn(ProductModelMapper, 'toEntity');

      const searchOutput = await repository.search(new ProductSearchParams());
      expect(searchOutput).toBeInstanceOf(ProductSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Product);
        expect(item.product_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Product',
          price: 100,
        }),
      );
    });

    test('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name']);

      const products = [
        Product.fake().aProduct().withName('b').build(),
        Product.fake().aProduct().withName('a').build(),
        Product.fake().aProduct().withName('d').build(),
        Product.fake().aProduct().withName('e').build(),
        Product.fake().aProduct().withName('c').build(),
      ];
      await repository.bulkInsert(products);

      const arrange = [
        {
          params: new ProductSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new ProductSearchResult({
            items: [products[1], products[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new ProductSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new ProductSearchResult({
            items: [products[4], products[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new ProductSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new ProductSearchResult({
            items: [products[3], products[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new ProductSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new ProductSearchResult({
            items: [products[4], products[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const products = [
        Product.fake().aProduct().withName('test').build(),
        Product.fake().aProduct().withName('a').build(),
        Product.fake().aProduct().withName('TEST').build(),
        Product.fake().aProduct().withName('e').build(),
        Product.fake().aProduct().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new ProductSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new ProductSearchResult({
            items: [products[2], products[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new ProductSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new ProductSearchResult({
            items: [products[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(products);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
