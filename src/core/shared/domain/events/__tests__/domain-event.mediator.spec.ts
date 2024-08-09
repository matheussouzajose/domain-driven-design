import {
  IDomainEvent,
  IIntegrationEvent,
} from '@core/shared/domain/events/domain-event.interface';
import EventEmitter2 from 'eventemitter2';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object/value-object';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event.mediator';
import { IDomainEventHandler } from '@core/shared/application/domain-event-handler.interface';

class StubEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number;
  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    this.occurred_on = new Date();
    this.event_version = 1;
  }

  getIntegrationEvent(): StubIntegrationEvent {
    return new StubIntegrationEvent(this);
  }
}

class StubIntegrationEvent implements IIntegrationEvent {
  occurred_on: Date;
  event_version: number;
  payload: any;
  event_name: string;
  constructor(event: StubEvent) {
    this.occurred_on = event.occurred_on;
    this.event_version = event.event_version;
    this.payload = event;
    this.event_name = this.constructor.name;
  }
}

class StubAggregate extends AggregateRoot {
  id: Uuid;
  name: string;

  action(name: string) {
    this.name = name;
    this.applyEvent(new StubEvent(this.id, this.name));
  }
  get entityId(): ValueObject {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
    };
  }

  get entity_id(): ValueObject {
    return undefined;
  }
}

class StubHandler implements IDomainEventHandler {
  async handle(event: StubEvent): Promise<void> {
    expect(event.name).toBe('test');
  }
}

class StubIntegrationHandler implements IDomainEventHandler {
  async handle(event: any): Promise<void> {
    expect(event.event_name).toBe(StubIntegrationEvent.name);
    expect(event.event_version).toBe(1);
    expect(event.occurred_on).toBeInstanceOf(Date);
    expect(event.payload.name).toBe('test');
  }
}

describe('DomainEventMediator Unit Tests', () => {
  let mediator: DomainEventMediator;

  beforeEach(() => {
    const eventEmitter = new EventEmitter2();
    mediator = new DomainEventMediator(eventEmitter);
  });

  test('Should publish handler', async () => {
    expect.assertions(1);
    mediator.register(StubEvent.name, new StubHandler());

    const aggregate = new StubAggregate();
    aggregate.action('test');
    await mediator.publish(aggregate);
    await mediator.publish(aggregate);
  });

  test('Should not publish an integration event', () => {
    expect.assertions(1);
    const spyEmitAsync = jest.spyOn(mediator['eventEmitter'], 'emitAsync');

    const aggregate = new StubAggregate();
    aggregate.action('test');
    Array.from(aggregate.events)[0].getIntegrationEvent = undefined;
    mediator.publishIntegrationEvents(aggregate);
    expect(spyEmitAsync).not.toBeCalled();
  });

  test('Should publish integration event', async () => {
    expect.assertions(4);
    mediator.register(StubIntegrationEvent.name, new StubIntegrationHandler());

    const aggregate = new StubAggregate();
    aggregate.action('test');
    await mediator.publishIntegrationEvents(aggregate);
  });
});
