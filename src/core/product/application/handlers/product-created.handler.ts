import { IDomainEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';

export class ProductCreatedHandler implements IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void> {
    console.log('ProductCreatedHandler', { event });
    return Promise.resolve();
  }
}
