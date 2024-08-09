import { LoadEntityError } from '@core/shared/domain/validator/validator.error';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';

export class ProductModelMapper {
  static toModel(entity: Product): ProductModel {
    return ProductModel.build({
      product_id: entity.product_id.id,
      name: entity.getName(),
      price: entity.getPrice(),
    });
  }

  static toEntity(model: ProductModel): Product {
    const product = new Product({
      product_id: new ProductId(model.product_id),
      name: model.name,
      price: model.price,
    });

    product.validate();
    if (product.notification.hasErrors()) {
      throw new LoadEntityError(product.notification.toJSON());
    }
    return product;
  }
}
