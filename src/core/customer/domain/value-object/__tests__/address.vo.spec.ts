import { Address } from '@core/customer/domain/value-object/address.vo';

describe('Address Value Object Unit Test', () => {
  test.each([
    ['', 100, '03807060', 'São Paulo', 'SP', 'street should not be empty'],
  ])(
    'Should throw when given invalid value',
    (street, number, zip, city, state, expectedError) => {
      const address = Address.create(
        street,
        number,
        zip,
        city,
        state,
        expectedError,
      );
      expect(address.isFail()).toBeTruthy();
      expect(address.error.name).toBe('InvalidAddressError');
      expect(address.error.message).toBe(expectedError);
    },
  );

  test('Should be create an address', () => {
    const expectedStreet = 'Rua Palmeira de Leque';
    const expectedNumber = 100;
    const expectedZip = '03807060';
    const expectedCity = 'São Paulo';
    const expectedState = 'SP';
    const expectedComplement = 'APTO 71';
    const address = Address.create(
      expectedStreet,
      expectedNumber,
      expectedZip,
      expectedCity,
      expectedState,
      expectedComplement,
    );
    expect(address.isOk()).toBeTruthy();
    expect(address.ok.street).toBe(expectedStreet);
    expect(address.ok.number).toBe(expectedNumber);
    expect(address.ok.zip).toBe(expectedZip);
    expect(address.ok.city).toBe(expectedCity);
    expect(address.ok.state).toBe(expectedState);
    expect(address.ok.complement).toBe(expectedComplement);
  });
});
