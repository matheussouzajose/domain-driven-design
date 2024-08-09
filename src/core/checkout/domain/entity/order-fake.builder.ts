import { Chance } from 'chance';
import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';
import { Order, OrderId } from '@core/checkout/domain/entity/order.aggregate';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class OrderFakeBuilder<TBuild = any> {
  private _order_id: PropOrFactory<OrderId> | undefined = undefined;
  private _customer_id: PropOrFactory<CustomerId> | undefined = () =>
    new CustomerId();
  private _items: PropOrFactory<OrderItem[]> = () => [];
  private _total: PropOrFactory<number> = () => this.total;
  private chance: Chance.Chance;
  private readonly countObjs: number;

  static anOrder() {
    return new OrderFakeBuilder<Order>();
  }

  static anOrders(countObjs: number) {
    return new OrderFakeBuilder<Order[]>(countObjs);
  }

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withOrderId(valueOrFactory: PropOrFactory<OrderId>) {
    this._order_id = valueOrFactory;
    return this;
  }

  withCustomerId(valueOrFactory: PropOrFactory<CustomerId>) {
    this._customer_id = valueOrFactory;
    return this;
  }

  withItem(valueOrFactory: PropOrFactory<OrderItem[]>) {
    this._items = valueOrFactory;
    return this;
  }

  get order_id() {
    return this.getValue('order_id');
  }

  get customer_id() {
    return this.getValue('customer_id');
  }

  get items() {
    return this.getValue('items').reduce(
      (acc, item) => acc + item.getTotal(),
      0,
    );
  }

  get total() {
    return this.getValue('quantity') * this.getValue('price');
  }

  private getValue(prop: any) {
    const optional = ['order_id'];
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
        return new Order({
          order_id: !this._order_id
            ? new OrderId()
            : this.callFactory(this._order_id, index),
          customer_id: !this._customer_id
            ? new CustomerId()
            : this.callFactory(this._customer_id, index),
          items: this.callFactory(this._items, index),
        });
      });
    return this.countObjs === 1 ? (customers[0] as any) : customers;
  }
}
