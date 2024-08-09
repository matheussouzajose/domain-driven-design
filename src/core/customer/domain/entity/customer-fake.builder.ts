import {
  Customer,
  CustomerId,
} from '@core/customer/domain/entity/customer.aggregate';
import { Chance } from 'chance';
import { Address } from '@core/customer/domain/value-object/address.vo';
import { random } from 'lodash';

type PropOrFactory<T> = T | ((index: number) => T);

export class CustomerFakeBuilder<TBuild = any> {
  private _customer_id: PropOrFactory<CustomerId> | undefined = undefined;
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _address: PropOrFactory<Address> = () =>
    Address.create(
      this.chance.street(),
      random(1, 100),
      this.chance.zip(),
      this.chance.city(),
      this.chance.state(),
    ).ok;
  private _is_active: PropOrFactory<boolean> = () => true;
  private _reward_points: PropOrFactory<number> = 0;
  private chance: Chance.Chance;
  private readonly countObjs: number;

  static aCustomer() {
    return new CustomerFakeBuilder<Customer>();
  }

  static aCustomers(countObjs: number) {
    return new CustomerFakeBuilder<Customer[]>(countObjs);
  }

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withCustomerId(valueOrFactory: PropOrFactory<CustomerId>) {
    this._customer_id = valueOrFactory;
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

  withAddress(valueOrFactory: PropOrFactory<Address>) {
    this._address = valueOrFactory;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  addRewardPoints(points: number) {
    this._reward_points = points;
    return this;
  }

  get customer_id() {
    return this.getValue('customer_id');
  }

  get name() {
    return this.getValue('name');
  }

  get address() {
    return this.getValue('address');
  }

  get isActive() {
    return this.getValue('is_active');
  }

  private getValue(prop: any) {
    const optional = ['customer_id'];
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
        return new Customer({
          customer_id: !this._customer_id
            ? new CustomerId()
            : this.callFactory(this._customer_id, index),
          name: this.callFactory(this._name, index),
          address: this.callFactory(this._address, index),
          is_active: this.callFactory(this._is_active, index),
        });
      });
    return this.countObjs === 1 ? (customers[0] as any) : customers;
  }
}
