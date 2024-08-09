import { OrderService } from '@core/checkout/domain/service/order.service';
import { CustomerFakeBuilder } from '@core/customer/domain/entity/customer-fake.builder';
import { OrderItemFakeBuilder } from '@core/checkout/domain/entity/order_item-fake.builder';
import { Order } from '@core/checkout/domain/entity/order.aggregate';
import { OrderFakeBuilder } from '@core/checkout/domain/entity/order-fake.builder';

describe('Order Service Unit Test', () => {
  test('Should throw error when items is empty', () => {
    const customer = CustomerFakeBuilder.aCustomer().build();
    expect(() => OrderService.placeOrder(customer, [])).toThrow(
      'Order must have at least one item',
    );
  });

  test('Should add rewards points', () => {
    const customer = CustomerFakeBuilder.aCustomer().build();
    const orderItem = OrderItemFakeBuilder.anOrderItem()
      .withPrice(100)
      .withQuantity(1)
      .build();
    const result = OrderService.placeOrder(customer, [orderItem]);
    expect(result).toBeInstanceOf(Order);
    expect(customer.getRewardPoints()).toBe(50);
  });

  test('Should get total value of order', () => {
    const orderItem = OrderItemFakeBuilder.anOrderItem()
      .withPrice(100)
      .withQuantity(2)
      .build();
    const order = OrderFakeBuilder.anOrder().withItem([orderItem]).build();
    expect(OrderService.total([order])).toBe(200);
  });
});
