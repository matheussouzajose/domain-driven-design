import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { ProductValidatorFactory } from '@core/product/domain/validator/product-validator.factory';
import { ProductFakeBuilder } from '@core/product/domain/entity/product-fake.builder';
import { ProductCreatedEvent } from '@core/product/domain/event/product-created.event';

export class ProductId extends Uuid {}

export type ProductConstructorProps = {
  product_id: ProductId;
  name: string;
  price: number;
};

export type ProductCreateCommand = {
  name: string;
  price: number;
};

export class Product extends AggregateRoot {
  readonly product_id: ProductId;
  private name: string;
  private price: number;

  constructor(props: ProductConstructorProps) {
    super();
    this.product_id = props.product_id;
    this.name = props.name;
    this.price = props.price;
    this.validate(['name']);
  }

  validate(fields?: string[]): void {
    const validator = ProductValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  static create(createCommand: ProductCreateCommand): Product {
    const product = new Product({
      product_id: new ProductId(),
      name: createCommand.name,
      price: createCommand.price,
    });

    product.applyEvent(
      new ProductCreatedEvent(
        product.entity_id,
        product.getName(),
        product.getPrice(),
      ),
    );
    return product;
  }

  get entity_id(): ProductId {
    return this.product_id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changePrice(price: number): void {
    this.price = price;
  }

  static fake() {
    return ProductFakeBuilder;
  }

  toJSON() {
    return {
      product_id: this.product_id,
      name: this.name,
      price: this.price,
    };
  }
}
