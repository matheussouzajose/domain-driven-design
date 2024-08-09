import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { ProductFakeBuilder } from '@core/product/domain/entity/product-fake.builder';

describe('Product Aggregate Unit Tests', () => {
  beforeEach(() => {
    Product.prototype.validate = jest
      .fn()
      .mockImplementation(Product.prototype.validate);
  });

  test('Should be create new product', () => {
    const expectedName = 'John Doe';
    const expectedPrice = 10;
    const product = Product.create({
      name: expectedName,
      price: expectedPrice,
    });
    expect(product).toBeInstanceOf(Product);
    expect(product.product_id).toBeInstanceOf(ProductId);
    expect(product.getName()).toBe(expectedName);
    expect(product.getPrice()).toBe(expectedPrice);
  });

  test('Should be restore product', () => {
    const expectedProductId = new ProductId();
    const expectedName = 'John Doe';
    const expectedPrice = 10;
    const customer = new Product({
      product_id: expectedProductId,
      name: expectedName,
      price: expectedPrice,
    });
    expect(customer.product_id).toBe(expectedProductId);
    expect(customer.getName()).toBe(expectedName);
    expect(customer.getPrice()).toBe(expectedPrice);
  });

  test('Should be change name', () => {
    const product = Product.create({
      name: 'John Doe',
      price: 10,
    });
    const expectedName = 'new John Doe';
    product.changeName(expectedName);
    expect(product.getName()).toBe(expectedName);
  });

  test('Should be change price', () => {
    const product = Product.create({
      name: 'John Doe',
      price: 10,
    });
    const expectedPrice = 20;
    product.changePrice(expectedPrice);
    expect(product.getPrice()).toBe(expectedPrice);
  });

  test('Should be instance fake builder', () => {
    const productFake = Product.fake();
    expect(new productFake()).toBeInstanceOf(ProductFakeBuilder);
  });

  test('Should be format to JSON', () => {
    const expectedProductId = new ProductId();
    const expectedName = 'John Doe';
    const expectedPrice = 10;
    const customer = new Product({
      product_id: expectedProductId,
      name: expectedName,
      price: 10,
    });
    expect(customer.toJSON()).toEqual({
      product_id: expectedProductId,
      name: expectedName,
      price: expectedPrice,
    });
  });
});
