import { OrderItemValidator } from '@core/checkout/domain/validator/order_item-validator';

export class OrderItemValidatorFactory {
  static create() {
    return new OrderItemValidator();
  }
}
