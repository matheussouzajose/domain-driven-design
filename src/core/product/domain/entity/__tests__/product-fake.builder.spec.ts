import { ProductFakeBuilder } from '@core/product/domain/entity/product-fake.builder';
import { ProductId } from '@core/product/domain/entity/product.aggregate';
import { Chance } from 'chance';

describe('Product Fake Builder Unit Test', () => {
  describe('product_id prop', () => {
    const faker = ProductFakeBuilder.aProduct();
    test('product_id prop', () => {
      expect(() => faker.product_id).toThrowError(
        new Error("Property product_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_product_id']).toBeUndefined();
    });

    test('withProductId', () => {
      const productId = new ProductId();
      const $this = faker.withProductId(productId);
      expect($this).toBeInstanceOf(ProductFakeBuilder);
      expect(faker['_product_id']).toBe(productId);

      faker.withProductId(() => productId);
      //@ts-expect-error name is callable
      expect(faker['_product_id']()).toBe(productId);
      expect(faker.product_id).toBe(productId);
    });

    test('should pass index to customer_id factory', () => {
      let mockFactory = jest.fn(() => new ProductId());
      faker.withProductId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const productId = new ProductId();
      mockFactory = jest.fn(() => productId);
      const fakerMany = ProductFakeBuilder.aProducts(2);
      fakerMany.withProductId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].product_id).toBe(productId);
      expect(fakerMany.build()[1].product_id).toBe(productId);
    });
  });

  describe('name prop', () => {
    const faker = ProductFakeBuilder.aProduct();

    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(ProductFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');
      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const customer = faker.build();
      expect(customer.getName()).toBe(`test name 0`);

      const fakerMany = ProductFakeBuilder.aProducts(2);
      fakerMany.withName((index) => `test name ${index}`);
      const customers = fakerMany.build();

      expect(customers[0].getName()).toBe(`test name 0`);
      expect(customers[1].getName()).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(ProductFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('address prop', () => {
    const faker = ProductFakeBuilder.aProduct();
    test('should be a function', () => {
      expect(typeof faker['_price']).toBe('function');
    });

    test('withAddress', () => {
      const $this = faker.withPrice(10);
      expect($this).toBeInstanceOf(ProductFakeBuilder);
      expect(faker['_price']).toBe(10);

      faker.withPrice(() => 10);
      //@ts-expect-error address is callable
      expect(faker['_price']()).toEqual(10);
    });
  });

  test('should create a product', () => {
    const faker = ProductFakeBuilder.aProduct();
    let product = faker.build();

    expect(product.product_id).toBeInstanceOf(ProductId);
    expect(typeof product.getName() === 'string').toBeTruthy();
    expect(typeof product.getPrice() === 'number').toBeTruthy();

    const productId = new ProductId();
    product = faker
      .withProductId(productId)
      .withName('name test')
      .withPrice(20)
      .build();

    expect(product.product_id).toBe(productId);
    expect(product.getName()).toBe('name test');
    expect(product.getPrice()).toBe(20);
  });

  test('should create many customers', () => {
    const faker = ProductFakeBuilder.aProducts(2);
    let products = faker.build();

    products.forEach((product) => {
      expect(product.product_id).toBeInstanceOf(ProductId);
      expect(typeof product.getName() === 'string').toBeTruthy();
      expect(typeof product.getPrice() === 'number').toBeTruthy();
    });

    const productId = new ProductId();
    products = faker
      .withProductId(productId)
      .withName('name test')
      .withPrice(10)
      .build();

    products.forEach((product) => {
      expect(product.product_id).toBe(productId);
      expect(product.getName()).toBe('name test');
      expect(product.getPrice()).toBe(10);
    });
  });
});
