import { Chance } from 'chance';
import { random } from 'lodash';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class ProductFakeBuilder<TBuild = any> {
  private _product_id: PropOrFactory<ProductId> | undefined = undefined;
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _price: PropOrFactory<number> = () => random(1, 100);
  private chance: Chance.Chance;
  private readonly countObjs: number;

  static aProduct() {
    return new ProductFakeBuilder<Product>();
  }

  static aProducts(countObjs: number) {
    return new ProductFakeBuilder<Product[]>(countObjs);
  }

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withProductId(valueOrFactory: PropOrFactory<ProductId>) {
    this._product_id = valueOrFactory;
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

  withPrice(valueOrFactory: PropOrFactory<number>) {
    this._price = valueOrFactory;
    return this;
  }

  get product_id() {
    return this.getValue('product_id');
  }

  get name() {
    return this.getValue('name');
  }

  get price() {
    return this.getValue('price');
  }

  private getValue(prop: any) {
    const optional = ['product_id'];
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
        return new Product({
          product_id: !this._product_id
            ? new ProductId()
            : this.callFactory(this._product_id, index),
          name: this.callFactory(this._name, index),
          price: this.callFactory(this._price, index),
        });
      });
    return this.countObjs === 1 ? (customers[0] as any) : customers;
  }
}
