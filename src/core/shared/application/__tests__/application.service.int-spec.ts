import { ApplicationService } from '@core/shared/application/application.service';
import { UnitOfWorkSequelize } from '@core/shared/infra/persistence/sequelize/unit-of-work-sequelize';
import { ProductSequelizeRepository } from '@core/product/infra/persistence/sequelize/product-sequelize.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';
import { Product } from '@core/product/domain/entity/product.aggregate';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event.mediator';
import EventEmitter2 from 'eventemitter2';

describe('Application Service Unit Tests', () => {
  let repository: ProductSequelizeRepository;
  let uow: UnitOfWorkSequelize;
  let domainEventMediator: DomainEventMediator;

  const sequelizeHelper = setupSequelize({ models: [ProductModel] });

  beforeEach(async () => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    repository = new ProductSequelizeRepository(ProductModel, uow);
    domainEventMediator = new DomainEventMediator(new EventEmitter2());
  });

  test('should run application', async () => {
    // domainEventMediator.register(
    //   ProductCreatedIntegrationEvent.name,
    //   new ProductCreatedHandler(),
    // );

    // domainEventMediator.register(
    //   ProductCreatedIntegrationEvent.name,
    //   new SendEmailProductCreatedHandler(),
    // );

    const applicationService = new ApplicationService(uow, domainEventMediator);
    await applicationService.run(async () => {
      const product = Product.create({ name: 'Product 1', price: 10 });
      await repository.insert(product);
    });
  });
});
