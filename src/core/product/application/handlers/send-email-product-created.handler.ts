import { IDomainEventHandler } from '@core/shared/application/domain-event-handler.interface';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';

export class SendEmailProductCreatedHandler implements IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void> {
    console.log('SendEmailProductCreatedHandler', { event });
    return Promise.resolve();
  }
}
