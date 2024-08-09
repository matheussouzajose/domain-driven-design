import { OrderValidator } from '@core/checkout/domain/validator/order-validator';

export class OrderValidatorFactory {
  static create() {
    return new OrderValidator();
  }
}
