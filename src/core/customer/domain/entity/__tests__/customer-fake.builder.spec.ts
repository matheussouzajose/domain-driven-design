import { CustomerFakeBuilder } from '@core/customer/domain/entity/customer-fake.builder';
import { CustomerId } from '@core/customer/domain/entity/customer.aggregate';
import { Chance } from 'chance';
import { Address } from '@core/customer/domain/value-object/address.vo';

describe('CustomerFake Builder Unit Test', () => {
  const address = Address.create(
    'Rua Onze',
    11,
    '123456789',
    'São Paulo',
    'SP',
  ).ok;

  describe('customer_id prop', () => {
    const faker = CustomerFakeBuilder.aCustomer();
    test('customer_id prop', () => {
      expect(() => faker.customer_id).toThrowError(
        new Error(
          "Property customer_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_customer_id']).toBeUndefined();
    });

    test('withCustomerId', () => {
      const customer_id = new CustomerId();
      const $this = faker.withCustomerId(customer_id);
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_customer_id']).toBe(customer_id);

      faker.withCustomerId(() => customer_id);
      //@ts-expect-error name is callable
      expect(faker['_customer_id']()).toBe(customer_id);
      expect(faker.customer_id).toBe(customer_id);
    });

    test('should pass index to customer_id factory', () => {
      let mockFactory = jest.fn(() => new CustomerId());
      faker.withCustomerId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);
      const customerId = new CustomerId();
      mockFactory = jest.fn(() => customerId);
      const fakerMany = CustomerFakeBuilder.aCustomers(2);
      fakerMany.withCustomerId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].customer_id).toBe(customerId);
      expect(fakerMany.build()[1].customer_id).toBe(customerId);
    });
  });

  describe('name prop', () => {
    const faker = CustomerFakeBuilder.aCustomer();

    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');
      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const customer = faker.build();
      expect(customer.getName()).toBe(`test name 0`);

      const fakerMany = CustomerFakeBuilder.aCustomers(2);
      fakerMany.withName((index) => `test name ${index}`);
      const customers = fakerMany.build();

      expect(customers[0].getName()).toBe(`test name 0`);
      expect(customers[1].getName()).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('address prop', () => {
    const faker = CustomerFakeBuilder.aCustomer();
    test('should be a function', () => {
      expect(typeof faker['_address']).toBe('function');
    });

    test('withAddress', () => {
      const $this = faker.withAddress(address);
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_address']).toEqual(address);

      faker.withAddress(() => address);
      //@ts-expect-error address is callable
      expect(faker['_address']()).toEqual(address);

      expect(faker.address).toEqual(address);
    });
  });

  describe('is_active prop', () => {
    const faker = CustomerFakeBuilder.aCustomer();
    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.isActive).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CustomerFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.isActive).toBe(false);
    });
  });

  test('should create a customer', () => {
    const faker = CustomerFakeBuilder.aCustomer();
    let customer = faker.build();

    expect(customer.customer_id).toBeInstanceOf(CustomerId);
    expect(typeof customer.getName() === 'string').toBeTruthy();
    expect(customer.getAddress()).toBeInstanceOf(Address);
    expect(customer.isActive()).toBe(true);

    const customer_id = new CustomerId();
    customer = faker
      .withCustomerId(customer_id)
      .withName('name test')
      .withAddress(address)
      .deactivate()
      .build();

    expect(customer.customer_id).toBe(customer_id);
    expect(customer.getName()).toBe('name test');
    expect(customer.getAddress()).toEqual(address);
    expect(customer.isActive()).toBe(false);
  });

  test('should create many customers', () => {
    const faker = CustomerFakeBuilder.aCustomers(2);
    let customers = faker.build();

    customers.forEach((category) => {
      expect(category.customer_id).toBeInstanceOf(CustomerId);
      expect(typeof category.getName() === 'string').toBeTruthy();
      // expect(typeof category.getAddress() === 'string').toBeTruthy();
      expect(category.isActive()).toBe(true);
    });

    const customer_id = new CustomerId();
    customers = faker
      .withCustomerId(customer_id)
      .withName('name test')
      .withAddress(address)
      .deactivate()
      .build();

    customers.forEach((category) => {
      expect(category.customer_id).toBe(customer_id);
      expect(category.getName()).toBe('name test');
      expect(category.getAddress()).toEqual(address);
      expect(category.isActive()).toBe(false);
    });
  });
});
