import { Entity } from '@core/shared/domain/entity/entity';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { OrderItemValidatorFactory } from '@core/checkout/domain/validator/order_item-validator.factory';
import { OrderItemFakeBuilder } from '@core/checkout/domain/entity/order_item-fake.builder';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

export class OrderItemId extends Uuid {}

export type OrderItemConstructorProps = {
  order_item_id: OrderItemId;
  product_id: ProductId;
  name: string;
  price: number;
  quantity: number;
};

export type OrderItemCreateCommand = {
  product_id: ProductId;
  name: string;
  price: number;
  quantity: number;
};

export class OrderItem extends Entity {
  readonly order_item_id: OrderItemId;
  private product_id: ProductId;
  private name: string;
  private price: number;
  private quantity: number;
  private readonly total: number;

  constructor(props: OrderItemConstructorProps) {
    super();
    this.order_item_id = props.order_item_id;
    this.product_id = props.product_id;
    this.name = props.name;
    this.price = props.price;
    this.quantity = props.quantity;
    this.total = this.getTotal();
    this.validate(['name']);
  }

  validate(fields?: string[]): void {
    const validator = OrderItemValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  static create(createCommand: OrderItemCreateCommand): OrderItem {
    return new OrderItem({
      order_item_id: new OrderItemId(),
      product_id: createCommand.product_id,
      name: createCommand.name,
      price: createCommand.price,
      quantity: createCommand.quantity,
    });
  }

  getProductId(): ProductId {
    return this.product_id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getTotal(): number {
    return this.price * this.quantity;
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeProductId(productId: ProductId): void {
    this.product_id = productId;
  }

  changePrice(price: number): void {
    this.price = price;
  }

  changeQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  static fake() {
    return OrderItemFakeBuilder;
  }

  toJSON() {
    return {
      order_item_id: this.order_item_id,
      product_id: this.product_id,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      total: this.total,
    };
  }

  get entity_id(): OrderItemId {
    return this.order_item_id;
  }
}
