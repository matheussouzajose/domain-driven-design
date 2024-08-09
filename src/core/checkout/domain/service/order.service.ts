import { Customer } from '@core/customer/domain/entity/customer.aggregate';
import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';
import { Order } from '@core/checkout/domain/entity/order.aggregate';

export class OrderService {
  static placeOrder(customer: Customer, items: OrderItem[]) {
    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    const order = new Order({
      customer_id: customer.customer_id,
      items: items,
    });
    customer.addRewardPoints(order.getTotal() / 2);
    return order;
  }

  static total(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.getTotal(), 0);
  }
}
