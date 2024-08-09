import { Notification } from '@core/shared/domain/validator/notification';
import { ValueObject } from '@core/shared/domain/value-object/value-object';

export abstract class Entity {
  notification: Notification = new Notification();
  abstract get entity_id(): ValueObject;
}
