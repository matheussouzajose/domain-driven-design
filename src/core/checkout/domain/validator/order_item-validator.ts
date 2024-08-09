import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';
import { Notification } from '@core/shared/domain/validator/notification';
import { MaxLength } from 'class-validator';
import { OrderItem } from '@core/checkout/domain/entity/order_item.entity';

export class OrderItemRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: OrderItem) {
    Object.assign(this, entity);
  }
}

export class OrderItemValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    return super.validate(notification, new OrderItemRules(data), fields);
  }
}
