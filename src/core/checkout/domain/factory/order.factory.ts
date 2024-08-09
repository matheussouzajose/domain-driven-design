import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';
import { Order } from '../entity/order.aggregate';
import { ProductId } from '@core/product/domain/entity/product.aggregate';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';

interface OrderFactoryProps {
  customerId: string;
  items: {
    name: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export default class OrderFactory {
  public static create(props: OrderFactoryProps): Order {
    const items = props.items.map((item) => {
      return OrderItem.create({
        name: item.name,
        product_id: new ProductId(item.productId),
        price: item.price,
        quantity: item.quantity,
      });
    });
    return Order.create({
      customer_id: new CustomerId(props.customerId),
      items,
    });
  }
}
