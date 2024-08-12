import { IUseCase } from '@core/shared/application/use-case.interface';
import { CreateProductInput } from '@core/product/application/use-cases/create/create-product.input';
import { ProductOutput, ProductOutputMapper } from '@core/product/application/use-cases/common/product-output';
import { IProductRepository } from '@core/product/domain/repository/product.repository.interface';
import { Product } from '@core/product/domain/entity/product.aggregate';
import { EntityValidationError } from '@core/shared/domain/validator/validator.error';
import { ApplicationService } from '@core/shared/application/application.service';

export class CreateProductUseCase implements IUseCase<CreateProductInput, CreateProductOutput> {
  constructor(
    private readonly appService: ApplicationService,
    private readonly productRepository: IProductRepository
  ) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const entity = Product.create(input);
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.appService.run(async () => {
      return this.productRepository.insert(entity);
    })
    return ProductOutputMapper.toOutput(entity);
  }
}

export type CreateProductOutput = ProductOutput;