import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';
import { Notification } from '@core/shared/domain/validator/notification';
import { MaxLength } from 'class-validator';
import { Customer } from '@core/customer/domain/entity/customer.aggregate';

export class CustomerRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: Customer) {
    Object.assign(this, entity);
  }
}

export class CustomerValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    return super.validate(notification, new CustomerRules(data), fields);
  }
}
