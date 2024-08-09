import {
  Customer,
  CustomerId,
} from '@core/customer/domain/entity/customer.aggregate';
import { CustomerFakeBuilder } from '@core/customer/domain/entity/customer-fake.builder';
import { Address } from '@core/customer/domain/value-object/address.vo';

describe('Customer Entity Unit Tests', () => {
  beforeEach(() => {
    Customer.prototype.validate = jest
      .fn()
      .mockImplementation(Customer.prototype.validate);
  });

  const address = Address.create(
    'Rua Onze',
    11,
    '123456789',
    'São Paulo',
    'SP',
  ).ok;

  test('Should be create new customer', () => {
    const expectedName = 'John Doe';
    const customer = Customer.create({
      name: expectedName,
      address,
    });
    expect(customer).toBeInstanceOf(Customer);
    expect(customer.customer_id).toBeInstanceOf(CustomerId);
    expect(customer.getName()).toBe(expectedName);
    expect(customer.getAddress()).toEqual(address);
    expect(customer.isActive()).toBeTruthy();
  });

  test('Should be restore customer', () => {
    const expectedCustomerId = new CustomerId();
    const expectedName = 'John Doe';
    const customer = new Customer({
      customer_id: expectedCustomerId,
      name: expectedName,
      address: address,
      is_active: true,
    });
    expect(customer.customer_id).toBe(expectedCustomerId);
    expect(customer.getName()).toBe(expectedName);
    expect(customer.getAddress()).toBe(address);
    expect(customer.isActive()).toBeTruthy();
  });

  test('Should be change name', () => {
    const customer = Customer.create({
      name: 'John',
      address: address,
    });
    const expectedName = 'John Doe';
    customer.changeName(expectedName);
    expect(customer.getName()).toBe(expectedName);
  });

  test('Should be change address', () => {
    const customer = Customer.create({
      name: 'John',
      address,
    });
    const newAddress = Address.create(
      'Nova Rua',
      11,
      '123456789',
      'São Paulo',
      'SP',
    ).ok;
    customer.changeAddress(newAddress);
    expect(customer.getAddress()).toBe(newAddress);
  });

  test('Should be deactivate and activate', () => {
    const customer = Customer.create({
      name: 'John',
      address,
    });
    customer.deactivate();
    expect(customer.isActive()).toBeFalsy();
    customer.activate();
    expect(customer.isActive()).toBeTruthy();
  });

  test('Should be instance fake builder', () => {
    const customerFake = Customer.fake();
    expect(new customerFake()).toBeInstanceOf(CustomerFakeBuilder);
  });

  test('Should be format to JSON', () => {
    const expectedCustomerId = new CustomerId();
    const expectedName = 'John Doe';
    const customer = new Customer({
      customer_id: expectedCustomerId,
      name: expectedName,
      address,
      is_active: true,
    });
    expect(customer.toJSON()).toEqual({
      customer_id: expectedCustomerId,
      name: expectedName,
      address: address,
      is_active: true,
      reward_points: 0,
    });
  });

  test('Should be add reward points ', () => {
    const customer = new Customer({
      customer_id: new CustomerId(),
      name: 'John Doe',
      address,
      is_active: true,
    });
    customer.addRewardPoints(10);
    expect(customer.getRewardPoints()).toBe(10);
  });
});
