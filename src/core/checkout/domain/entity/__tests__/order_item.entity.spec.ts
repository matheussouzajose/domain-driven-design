import {
  OrderItem,
  OrderItemId,
} from '@core/checkout/domain/entity/order_item.entity';
import { OrderItemFakeBuilder } from '@core/checkout/domain/entity/order_item-fake.builder';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

describe('OrderItem Entity Unit Tests', () => {
  beforeEach(() => {
    OrderItem.prototype.validate = jest
      .fn()
      .mockImplementation(OrderItem.prototype.validate);
  });

  test('Should be create new order item', () => {
    const expectedName = 'Product Name';
    const expectedProductId = new ProductId();
    const expectedPrice = 100;
    const expectedQuantity = 2;
    const orderItem = OrderItem.create({
      name: expectedName,
      product_id: expectedProductId,
      price: expectedPrice,
      quantity: expectedQuantity,
    });
    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.order_item_id).toBeInstanceOf(OrderItemId);
    expect(orderItem.getName()).toBe(expectedName);
    expect(orderItem.getProductId()).toBe(expectedProductId);
    expect(orderItem.getPrice()).toBe(expectedPrice);
    expect(orderItem.getQuantity()).toBe(expectedQuantity);
    expect(orderItem.getTotal()).toBe(expectedPrice * expectedQuantity);
  });

  test('Should be restore order item', () => {
    const expectedOrderItemId = new OrderItemId();
    const expectedName = 'Product Name';
    const expectedProductId = new ProductId();
    const expectedPrice = 100;
    const expectedQuantity = 2;
    const orderItem = new OrderItem({
      order_item_id: expectedOrderItemId,
      name: expectedName,
      product_id: expectedProductId,
      price: expectedPrice,
      quantity: expectedQuantity,
    });
    expect(orderItem.order_item_id).toBe(expectedOrderItemId);
    expect(orderItem.getName()).toBe(expectedName);
    expect(orderItem.getProductId()).toBe(expectedProductId);
    expect(orderItem.getPrice()).toBe(expectedPrice);
    expect(orderItem.getQuantity()).toBe(expectedQuantity);
    expect(orderItem.getTotal()).toBe(expectedPrice * expectedQuantity);
  });

  test('Should be change name', () => {
    const orderItem = OrderItem.create({
      name: 'Product Name',
      product_id: new ProductId(),
      price: 100,
      quantity: 2,
    });
    const expectedProductId = new ProductId();
    orderItem.changeProductId(expectedProductId);
    expect(orderItem.getProductId()).toBe(expectedProductId);
  });

  test('Should be change name', () => {
    const orderItem = OrderItem.create({
      name: 'Product Name',
      product_id: new ProductId(),
      price: 100,
      quantity: 2,
    });
    const expectedName = 'New Product Name';
    orderItem.changeName(expectedName);
    expect(orderItem.getName()).toBe(expectedName);
  });

  test('Should be change price', () => {
    const orderItem = OrderItem.create({
      name: 'Product Name',
      product_id: new ProductId(),
      price: 100,
      quantity: 2,
    });
    const expectedPrice = 150;
    orderItem.changePrice(expectedPrice);
    expect(orderItem.getPrice()).toBe(expectedPrice);
  });

  test('Should be change quantity', () => {
    const orderItem = OrderItem.create({
      name: 'Product Name',
      product_id: new ProductId(),
      price: 100,
      quantity: 2,
    });
    const expectedQuantity = 3;
    orderItem.changeQuantity(expectedQuantity);
    expect(orderItem.getQuantity()).toBe(expectedQuantity);
  });

  test('Should be instance fake builder', () => {
    const orderItemFake = OrderItem.fake();
    expect(new orderItemFake()).toBeInstanceOf(OrderItemFakeBuilder);
  });

  test('Should be format to JSON', () => {
    const expectedOrderItemId = new OrderItemId();
    const expectedName = 'Product Name';
    const expectedProductId = new ProductId();
    const expectedPrice = 100;
    const expectedQuantity = 2;
    const orderItem = new OrderItem({
      order_item_id: expectedOrderItemId,
      name: expectedName,
      product_id: expectedProductId,
      price: expectedPrice,
      quantity: expectedQuantity,
    });
    expect(orderItem.toJSON()).toEqual({
      order_item_id: orderItem.order_item_id,
      name: orderItem.getName(),
      product_id: orderItem.getProductId(),
      price: orderItem.getPrice(),
      quantity: orderItem.getQuantity(),
      total: orderItem.getTotal(),
    });
  });
});
