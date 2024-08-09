import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';
import { Order, OrderId } from '@core/checkout/domain/entity/order.aggregate';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';
import { OrderFakeBuilder } from '@core/checkout/domain/entity/order-fake.builder';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

describe('Order Aggregate Unit Tests', () => {
  beforeEach(() => {
    Order.prototype.validate = jest
      .fn()
      .mockImplementation(Order.prototype.validate);
  });

  test('Should be create new order', () => {
    const expectedCustomerId = new CustomerId();
    const expectedProductId = new ProductId();
    const orderItemExpected = OrderItem.create({
      name: 'Product Name',
      product_id: expectedProductId,
      price: 100,
      quantity: 2,
    });
    const order = Order.create({
      customer_id: expectedCustomerId,
      items: [orderItemExpected],
    });
    expect(order).toBeInstanceOf(Order);
    expect(order.getCustomerId()).toBe(expectedCustomerId);
    expect(order.getItems()).toEqual([orderItemExpected]);
    expect(order.getTotal()).toBe(200);
  });

  test('Should be restore order', () => {
    const expectedOrderItemId = new OrderId();
    const expectedCustomerId = new CustomerId();
    const expectedProductId = new ProductId();
    const orderItemExpected = OrderItem.create({
      name: 'Product Name',
      product_id: expectedProductId,
      price: 100,
      quantity: 2,
    });
    const orderItemExpected2 = OrderItem.create({
      name: 'Product Name',
      product_id: expectedProductId,
      price: 100,
      quantity: 2,
    });
    const order = new Order({
      order_id: expectedOrderItemId,
      customer_id: expectedCustomerId,
      items: [orderItemExpected, orderItemExpected2],
    });
    expect(order.order_id).toBe(expectedOrderItemId);
    expect(order.getCustomerId()).toBe(expectedCustomerId);
    expect(order.getItems()).toEqual([orderItemExpected, orderItemExpected2]);
    expect(order.getTotal()).toBe(400);
  });

  test('Should be instance fake builder', () => {
    const orderFake = Order.fake();
    expect(new orderFake()).toBeInstanceOf(OrderFakeBuilder);
  });

  test('Should be format to JSON', () => {
    const expectedOrderItemId = new OrderId();
    const expectedCustomerId = new CustomerId();
    const expectedProductId = new ProductId();
    const orderItemExpected = OrderItem.create({
      name: 'Product Name',
      product_id: expectedProductId,
      price: 100,
      quantity: 2,
    });
    const orderItemExpected2 = OrderItem.create({
      name: 'Product Name',
      product_id: expectedProductId,
      price: 100,
      quantity: 2,
    });
    const order = new Order({
      order_id: expectedOrderItemId,
      customer_id: expectedCustomerId,
      items: [orderItemExpected, orderItemExpected2],
    });

    expect(order.toJSON()).toEqual({
      order_id: order.order_id,
      customer_id: order.getCustomerId(),
      items: order.getItems(),
      total: order.getTotal(),
    });
  });
});
