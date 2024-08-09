import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';
import { Notification } from '@core/shared/domain/validator/notification';
import { IsNotEmpty } from 'class-validator';
import { Order } from '@core/checkout/domain/entity/order.aggregate';

export class OrderRules {
  @IsNotEmpty({ groups: ['customer_id'] })
  customer_id: string;

  @IsNotEmpty({ groups: ['items'] })
  items: string;

  constructor(entity: Order) {
    Object.assign(this, entity);
  }
}

export class OrderValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    return super.validate(notification, new OrderRules(data), fields);
  }
}
