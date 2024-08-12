import { Product } from '@core/product/domain/entity/product.aggregate';

export type ProductOutput = {
  id: string;
  name: string;
  price: number;
};

export class ProductOutputMapper {
  static toOutput(entity: Product): ProductOutput {
    const { product_id, ...otherProps } = entity.toJSON();
    return {
      id: product_id.id,
      ...otherProps,
    };
  }
}
