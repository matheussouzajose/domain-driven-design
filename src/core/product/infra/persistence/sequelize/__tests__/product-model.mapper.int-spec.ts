import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';
import { LoadEntityError } from '@core/shared/domain/validator/validator.error';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { ProductModelMapper } from '@core/product/infra/persistence/sequelize/product-model.mapper';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [ProductModel] });

  test('should throws error when product is invalid', () => {
    expect.assertions(2);
    const model = ProductModel.build({
      product_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'a'.repeat(256),
      price: 100,
    });
    try {
      ProductModelMapper.toEntity(model);
      fail('The product is valid, but it needs throws a EntityValidationError');
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect((e as LoadEntityError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  test('should convert a category model to a product aggregate', () => {
    const model = ProductModel.build({
      product_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      price: 100,
    });
    const aggregate = ProductModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Product({
        product_id: new ProductId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        price: 100,
      }).toJSON(),
    );
  });
});
