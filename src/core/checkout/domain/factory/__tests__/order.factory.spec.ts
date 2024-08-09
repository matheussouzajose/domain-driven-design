import { Order } from '@core/checkout/domain/entity/order.aggregate';
import OrderFactory from '@core/checkout/domain/factory/order.factory';

describe('Product Factory Unit Test', () => {
  test('Should be create a product', () => {
    const order = OrderFactory.create({
      customerId: '321ee368-e325-4ff6-a2f3-2e0a96636bfb',
      items: [
        {
          name: 'test',
          productId: '321ee368-e325-4ff6-a2f3-2e0a96636bfb',
          price: 100,
          quantity: 2,
        },
      ],
    });
    expect(order).toBeInstanceOf(Order);
  });
});
