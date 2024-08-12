import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';
import { Notification } from '@core/shared/domain/validator/notification';
import { MaxLength } from 'class-validator';
import { Product } from '@core/product/domain/entity/product.aggregate';

export class ProductRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: Product) {
    Object.assign(this, entity);
  }
}

export class ProductValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    return super.validate(notification, new ProductRules(data), fields);
  }
}
