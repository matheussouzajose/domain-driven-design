import { CustomerFakeBuilder } from '@core/customer/domain/entity/customer-fake.builder';
import { CustomerValidatorFactory } from '@core/customer/domain/validator/customer-validator.factory';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { Address } from '@core/customer/domain/value-object/address.vo';
import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';

export type CustomerConstructorProps = {
  customer_id: CustomerId;
  name: string;
  address: Address;
  is_active: boolean;
};

export type CustomerCreateCommand = {
  name: string;
  address: Address;
};

export class CustomerId extends Uuid {}

export class Customer extends AggregateRoot {
  readonly customer_id: CustomerId;
  private name: string;
  private address: Address;
  private is_active: boolean;
  private reward_points: number = 0;

  constructor(props: CustomerConstructorProps) {
    super();
    this.customer_id = props.customer_id;
    this.name = props.name;
    this.address = props.address;
    this.is_active = props.is_active;
    this.validate(['name']);
  }

  static create(createCommand: CustomerCreateCommand): Customer {
    return new Customer({
      customer_id: new CustomerId(),
      name: createCommand.name,
      address: createCommand.address,
      is_active: true,
    });
  }

  validate(fields?: string[]) {
    const validator = CustomerValidatorFactory.create();
    validator.validate(this.notification, this, fields);
  }

  getName(): string {
    return this.name;
  }

  getAddress(): Address {
    return this.address;
  }

  isActive(): boolean {
    return this.is_active;
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeAddress(address: Address): void {
    this.address = address;
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  addRewardPoints(points: number): void {
    this.reward_points += points;
  }

  getRewardPoints() {
    return this.reward_points;
  }

  static fake() {
    return CustomerFakeBuilder;
  }

  toJSON() {
    return {
      customer_id: this.customer_id,
      name: this.name,
      address: this.address,
      is_active: this.is_active,
      reward_points: this.reward_points,
    };
  }

  get entity_id(): CustomerId {
    return this.customer_id;
  }
}
