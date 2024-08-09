import { Chance } from 'chance';
import { random } from 'lodash';
import {
  OrderItem,
  OrderItemId,
} from '@core/checkout/domain/entity/order_item.entity';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class OrderItemFakeBuilder<TBuild = any> {
  private _order_item_id: PropOrFactory<OrderItemId> | undefined = undefined;
  private _product_id: PropOrFactory<ProductId> | undefined = undefined;
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _price: PropOrFactory<number> = () => random(1, 100);
  private _quantity: PropOrFactory<number> = () => random(1, 5);
  private _total: PropOrFactory<number> = () => this.total;
  private chance: Chance.Chance;
  private readonly countObjs: number;

  static anOrderItem() {
    return new OrderItemFakeBuilder<OrderItem>();
  }

  static anOrderItems(countObjs: number) {
    return new OrderItemFakeBuilder<OrderItem[]>(countObjs);
  }

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withOrderItemId(valueOrFactory: PropOrFactory<OrderItemId>) {
    this._order_item_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withProductId(valueOrFactory: PropOrFactory<ProductId>) {
    this._product_id = valueOrFactory;
    return this;
  }

  withPrice(valueOrFactory: PropOrFactory<number>) {
    this._price = valueOrFactory;
    return this;
  }

  withQuantity(valueOrFactory: PropOrFactory<number>) {
    this._quantity = valueOrFactory;
    return this;
  }

  get order_item_id() {
    return this.getValue('order_item_id');
  }

  get name() {
    return this.getValue('name');
  }

  get product_id() {
    return this.getValue('product_id');
  }

  get price() {
    return this.getValue('price');
  }

  get quantity() {
    return this.getValue('quantity');
  }

  get total() {
    return this.getValue('quantity') * this.getValue('price');
  }
  private getValue(prop: any) {
    const optional = ['order_item_id'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }

  build(): TBuild {
    const customers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        return new OrderItem({
          order_item_id: !this._order_item_id
            ? new OrderItemId()
            : this.callFactory(this._order_item_id, index),
          name: this.callFactory(this._name, index),
          product_id: this.callFactory(this._product_id, index),
          price: this.callFactory(this._price, index),
          quantity: this.callFactory(this._quantity, index),
        });
      });
    return this.countObjs === 1 ? (customers[0] as any) : customers;
  }
}
