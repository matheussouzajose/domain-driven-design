import {
  IDomainEvent,
  IIntegrationEvent,
} from '@core/shared/domain/events/domain-event.interface';
import { ProductId } from '@core/product/domain/entity/product.aggregate';

export class ProductCreatedEvent implements IDomainEvent {
  aggregate_id: ProductId;
  event_version: number;
  occurred_on: Date;

  constructor(
    productId: ProductId,
    readonly name: string,
    readonly price: number,
  ) {
    this.aggregate_id = productId;
    this.event_version = 1;
    this.occurred_on = new Date();
  }

  getIntegrationEvent(): IIntegrationEvent {
    return new ProductCreatedIntegrationEvent(this);
  }
}

export class ProductCreatedIntegrationEvent implements IIntegrationEvent {
  event_name: string;
  event_version: number;
  occurred_on: Date;
  payload: any;

  constructor(event: ProductCreatedEvent) {
    this.event_version = event.event_version;
    this.occurred_on = event.occurred_on;
    this.payload = {
      product_id: event.aggregate_id.id,
      name: event.name,
      price: event.price,
    };
    this.event_name = this.constructor.name;
  }
}
