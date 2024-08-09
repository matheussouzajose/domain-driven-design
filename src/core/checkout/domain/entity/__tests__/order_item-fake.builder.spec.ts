import { OrderItemFakeBuilder } from '@core/checkout/domain/entity/order_item-fake.builder';
import { OrderItemId } from '@core/checkout/domain/entity/order_item.entity';
import { Chance } from 'chance';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

describe('OrderItem Builder Unit Test', () => {
  describe('order_item_id prop', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();
    test('order_item_id prop', () => {
      expect(() => faker.order_item_id).toThrowError(
        new Error(
          "Property order_item_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_order_item_id']).toBeUndefined();
    });

    test('withOrderItemId', () => {
      const orderItemId = new OrderItemId();
      const $this = faker.withOrderItemId(orderItemId);
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
      expect(faker['_order_item_id']).toBe(orderItemId);

      faker.withOrderItemId(() => orderItemId);
      //@ts-expect-error name is callable
      expect(faker['_order_item_id']()).toBe(orderItemId);
      expect(faker.order_item_id).toBe(orderItemId);
    });

    test('should pass index to order_item_id factory', () => {
      let mockFactory = jest.fn(() => new OrderItemId());
      faker.withOrderItemId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const orderItemId = new OrderItemId();
      mockFactory = jest.fn(() => orderItemId);
      const fakerMany = OrderItemFakeBuilder.anOrderItems(2);
      fakerMany.withOrderItemId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].order_item_id).toBe(orderItemId);
      expect(fakerMany.build()[1].order_item_id).toBe(orderItemId);
    });
  });

  describe('name prop', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();

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
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
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

      const fakerMany = OrderItemFakeBuilder.anOrderItems(2);
      fakerMany.withName((index) => `test name ${index}`);
      const customers = fakerMany.build();

      expect(customers[0].getName()).toBe(`test name 0`);
      expect(customers[1].getName()).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('product_id prop', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();

    test('withProductId', () => {
      const expectedProductId = new ProductId();
      const $this = faker.withProductId(expectedProductId);
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
      expect(faker['_product_id']).toBe(expectedProductId);

      faker.withProductId(() => expectedProductId);
      //@ts-expect-error name is callable
      expect(faker['_product_id']()).toBe(expectedProductId);
      expect(faker.product_id).toBe(expectedProductId);
    });
  });

  describe('price prop', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();

    test('should be a function', () => {
      expect(typeof faker['_price']).toBe('function');
    });

    test('price', () => {
      const $this = faker.withPrice(100);
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
      expect(faker['_price']).toBe(100);

      faker.withPrice(() => 100);
      //@ts-expect-error name is callable
      expect(faker['_price']()).toBe(100);
      expect(faker.price).toBe(100);
    });
  });

  describe('quantity prop', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();

    test('should be a function', () => {
      expect(typeof faker['_quantity']).toBe('function');
    });

    test('quantity', () => {
      const $this = faker.withQuantity(100);
      expect($this).toBeInstanceOf(OrderItemFakeBuilder);
      expect(faker['_quantity']).toBe(100);

      faker.withQuantity(() => 100);
      //@ts-expect-error name is callable
      expect(faker['_quantity']()).toBe(100);
      expect(faker.quantity).toBe(100);
    });
  });

  test('should create an orderItem', () => {
    const faker = OrderItemFakeBuilder.anOrderItem();
    let orderItem = faker.build();

    expect(orderItem.order_item_id).toBeInstanceOf(OrderItemId);
    expect(typeof orderItem.getName() === 'string').toBeTruthy();
    expect(typeof orderItem.getPrice() === 'number').toBeTruthy();
    expect(typeof orderItem.getQuantity() === 'number').toBeTruthy();
    expect(typeof orderItem.getTotal() === 'number').toBeTruthy();

    const orderItemId = new OrderItemId();
    const productId = new ProductId();
    orderItem = faker
      .withOrderItemId(orderItemId)
      .withProductId(productId)
      .withPrice(100)
      .withQuantity(1)
      .build();

    expect(orderItem.order_item_id).toBe(orderItemId);
    expect(orderItem.getProductId()).toBe(productId);
    expect(orderItem.getPrice()).toBe(100);
    expect(orderItem.getQuantity()).toBe(1);
    expect(orderItem.getTotal()).toBe(100);
  });

  test('should create many order items', () => {
    const faker = OrderItemFakeBuilder.anOrderItems(2);
    let orderItems = faker.build();

    orderItems.forEach((orderItem) => {
      expect(orderItem.order_item_id).toBeInstanceOf(OrderItemId);
      expect(typeof orderItem.getName() === 'string').toBeTruthy();
      expect(typeof orderItem.getPrice() === 'number').toBeTruthy();
      expect(typeof orderItem.getQuantity() === 'number').toBeTruthy();
      expect(typeof orderItem.getTotal() === 'number').toBeTruthy();
    });

    const orderItemId = new OrderItemId();
    const productId = new ProductId();
    orderItems = faker
      .withOrderItemId(orderItemId)
      .withProductId(productId)
      .withPrice(100)
      .withQuantity(1)
      .build();

    orderItems.forEach((orderItem) => {
      expect(orderItem.order_item_id).toBe(orderItemId);
      expect(orderItem.getProductId()).toBe(productId);
      expect(orderItem.getPrice()).toBe(100);
      expect(orderItem.getQuantity()).toBe(1);
      expect(orderItem.getTotal()).toBe(100);
    });
  });
});
