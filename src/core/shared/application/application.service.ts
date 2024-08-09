import { IUnitOfWork } from '../domain/repository/unit-of-work.interface';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event.mediator';

export class ApplicationService {
  constructor(
    private uow: IUnitOfWork,
    private domainEventMediator: DomainEventMediator,
  ) {}

  async start() {
    await this.uow.start();
  }

  async finish() {
    const aggregateRoots = [...this.uow.getAggregateRoots()];
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventMediator.publish(aggregateRoot);
    }
    await this.uow.commit();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventMediator.publishIntegrationEvents(aggregateRoot);
    }
  }

  async fail() {
    await this.uow.rollback();
  }

  async run<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.finish();
      return result;
    } catch (error) {
      await this.fail();
      throw error;
    }
  }
}
