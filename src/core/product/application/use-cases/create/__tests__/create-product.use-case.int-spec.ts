import { UnitOfWorkSequelize } from '@core/shared/infra/persistence/sequelize/unit-of-work-sequelize';
import { CreateProductUseCase } from '@core/product/application/use-cases/create/create-product.use-case';
import { IProductRepository } from '@core/product/domain/repository/product.repository.interface';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';
import { ProductSequelizeRepository } from '@core/product/infra/persistence/sequelize/product-sequelize.repository';
import { ApplicationService } from '@core/shared/application/application.service';
import EventEmitter2 from 'eventemitter2';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event.mediator';

describe('Create Product Use case Integration', () => {
  let uow: UnitOfWorkSequelize;
  let appService: ApplicationService;
  let domainEventMediator: DomainEventMediator;
  let productRepository: IProductRepository;
  let createProductUseCase: CreateProductUseCase

  const sequelizeHelper = setupSequelize({ models: [ProductModel] });
  const eventEmitter = new EventEmitter2()

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    domainEventMediator = new DomainEventMediator(eventEmitter);
    appService = new ApplicationService(uow, domainEventMediator);
    productRepository = new ProductSequelizeRepository(ProductModel, uow);
    createProductUseCase = new CreateProductUseCase(appService, productRepository);
  })

  it('should create an product', async () => {
    // domainEventMediator.register(
    //   ProductCreatedEvent.name,
    //   new ProductCreatedHandler(),
    // );
    //
    // domainEventMediator.register(
    //   ProductCreatedIntegrationEvent.name,
    //   new SendEmailProductCreatedHandler(),
    // );

    const result = await createProductUseCase.execute({
      name: 'Product 1',
      price: 100
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Product 1');
    expect(result.price).toBe(100);
  });
})