import { ProductValidator } from '@core/product/domain/validator/product-validator';

export class ProductValidatorFactory {
  static create() {
    return new ProductValidator();
  }
}
