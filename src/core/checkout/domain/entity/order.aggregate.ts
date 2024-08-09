import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';
import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';
import { OrderValidatorFactory } from '@core/checkout/domain/validator/order-validator.factory';
import { OrderFakeBuilder } from '@core/checkout/domain/entity/order-fake.builder';

export class OrderId extends Uuid {}

export type OrderConstructorProps = {
  order_id: OrderId;
  customer_id: CustomerId;
  items: OrderItem[];
};

export type OrderCreateCommand = {
  customer_id: CustomerId;
  items: OrderItem[];
};

export class Order extends AggregateRoot {
  readonly order_id: OrderId;
  private readonly customer_id: CustomerId;
  private readonly items: OrderItem[];
  readonly total: number;

  constructor(props: OrderConstructorProps) {
    super();
    this.order_id = props.order_id;
    this.customer_id = props.customer_id;
    this.items = props.items;
    this.total = this.getTotal();
    this.validate(['customer_id', 'items']);
  }

  validate(fields?: string[]): void {
    const validator = OrderValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  static create(createCommand: OrderCreateCommand): Order {
    return new Order({
      order_id: new OrderId(),
      customer_id: createCommand.customer_id,
      items: createCommand.items,
    });
  }

  getCustomerId(): CustomerId {
    return this.customer_id;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + item.getTotal(), 0);
  }

  static fake() {
    return OrderFakeBuilder;
  }

  toJSON() {
    return {
      order_id: this.order_id,
      customer_id: this.customer_id,
      items: this.items,
      total: this.total,
    };
  }

  get entity_id(): OrderId {
    return this.order_id;
  }
}
