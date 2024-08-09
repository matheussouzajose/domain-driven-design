import { CustomerValidator } from '@core/customer/domain/validator/customer-validator';

export class CustomerValidatorFactory {
  static create() {
    return new CustomerValidator();
  }
}
