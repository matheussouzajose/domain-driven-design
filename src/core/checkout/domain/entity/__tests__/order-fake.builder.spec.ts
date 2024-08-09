import { OrderItemFakeBuilder } from '@core/checkout/domain/entity/order_item-fake.builder';
import { OrderItemId } from '@core/checkout/domain/entity/order_item.entity';
import { OrderFakeBuilder } from '@core/checkout/domain/entity/order-fake.builder';
import { OrderId } from '@core/checkout/domain/entity/order.aggregate';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';

describe('Order Builder Unit Test', () => {
  describe('order_id prop', () => {
    const faker = OrderFakeBuilder.anOrder();
    test('order_item_id prop', () => {
      expect(() => faker.order_id).toThrowError(
        new Error("Property order_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_order_item_id']).toBeUndefined();
    });

    test('withOrderId', () => {
      const orderId = new OrderItemId();
      const $this = faker.withOrderId(orderId);
      expect($this).toBeInstanceOf(OrderFakeBuilder);
      expect(faker['_order_id']).toBe(orderId);

      faker.withOrderId(() => orderId);
      //@ts-expect-error name is callable
      expect(faker['_order_id']()).toBe(orderId);
      expect(faker.order_id).toBe(orderId);
    });

    test('should pass index to order_item_id factory', () => {
      let mockFactory = jest.fn(() => new OrderId());
      faker.withOrderId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const orderId = new OrderId();
      mockFactory = jest.fn(() => orderId);
      const fakerMany = OrderFakeBuilder.anOrders(2);
      fakerMany.withOrderId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].order_id).toBe(orderId);
      expect(fakerMany.build()[1].order_id).toBe(orderId);
    });
  });

  describe('customer_id prop', () => {
    const faker = OrderFakeBuilder.anOrder();

    test('should be a function', () => {
      expect(typeof faker['_customer_id']).toBe('function');
    });

    test('withProductId', () => {
      const $this = faker.withCustomerId(
        new CustomerId('5534ae26-5317-4a26-aa26-abca74e08507'),
      );
      expect($this).toBeInstanceOf(OrderFakeBuilder);
      expect(faker['_customer_id']).toEqual(
        new CustomerId('5534ae26-5317-4a26-aa26-abca74e08507'),
      );

      faker.withCustomerId(
        () => new CustomerId('5534ae26-5317-4a26-aa26-abca74e08507'),
      );
      //@ts-expect-error name is callable
      expect(faker['_customer_id']()).toEqual(
        new CustomerId('5534ae26-5317-4a26-aa26-abca74e08507'),
      );
      expect(faker.customer_id).toEqual(
        new CustomerId('5534ae26-5317-4a26-aa26-abca74e08507'),
      );
    });
  });

  describe('items prop', () => {
    const faker = OrderFakeBuilder.anOrder();

    test('should be a function', () => {
      expect(typeof faker['_items']).toBe('function');
    });

    test('items', () => {
      const items = [
        OrderItemFakeBuilder.anOrderItem().build(),
        OrderItemFakeBuilder.anOrderItem().build(),
      ];
      const $this = faker.withItem(items);
      expect($this).toBeInstanceOf(OrderFakeBuilder);
      expect(faker['_items']).toEqual(items);
    });
  });

  test('should create an order', () => {
    const faker = OrderFakeBuilder.anOrder();
    let order = faker.build();

    expect(order.order_id).toBeInstanceOf(OrderId);
    expect(order.getCustomerId()).toBeInstanceOf(CustomerId);
    expect(typeof order.getItems() === 'object').toBeTruthy();
    expect(typeof order.getTotal() === 'number').toBeTruthy();

    const orderId = new OrderId();
    const customerId = new CustomerId();
    const orderItem = OrderItemFakeBuilder.anOrderItem()
      .withPrice(2)
      .withQuantity(1)
      .build();
    order = faker
      .withOrderId(orderId)
      .withCustomerId(customerId)
      .withItem([orderItem])
      .build();

    expect(order.order_id).toBe(orderId);
    expect(order.getCustomerId()).toBe(customerId);
    expect(order.getItems()).toEqual([orderItem]);
    expect(order.getTotal()).toBe(2);
  });

  test('should create many order items', () => {
    const faker = OrderFakeBuilder.anOrders(2);
    let orders = faker.build();

    orders.forEach((order) => {
      expect(order.order_id).toBeInstanceOf(OrderId);
      expect(order.getCustomerId()).toBeInstanceOf(CustomerId);
      expect(typeof order.getItems() === 'object').toBeTruthy();
      expect(typeof order.getTotal() === 'number').toBeTruthy();
    });

    const orderId = new OrderId();
    const customerId = new CustomerId();
    const orderItem = OrderItemFakeBuilder.anOrderItem()
      .withPrice(2)
      .withQuantity(1)
      .build();
    orders = faker
      .withOrderId(orderId)
      .withCustomerId(customerId)
      .withItem([orderItem])
      .build();

    orders.forEach((order) => {
      expect(order.order_id).toBe(orderId);
      expect(order.getCustomerId()).toBe(customerId);
      expect(order.getItems()).toEqual([orderItem]);
      expect(order.getTotal()).toBe(2);
    });
  });
});
