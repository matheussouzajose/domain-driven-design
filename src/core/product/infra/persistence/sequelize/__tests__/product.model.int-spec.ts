import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { DataType } from 'sequelize-typescript';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';

describe('ProductModel Integration Tests', () => {
  setupSequelize({ models: [ProductModel] });

  test('mapping props', () => {
    const attributesMap = ProductModel.getAttributes();
    const attributes = Object.keys(ProductModel.getAttributes());

    expect(attributes).toStrictEqual(['product_id', 'name', 'price']);

    const categoryIdAttr = attributesMap.product_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'product_id',
      fieldName: 'product_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const priceAttr = attributesMap.price;
    expect(priceAttr).toMatchObject({
      field: 'price',
      fieldName: 'price',
      allowNull: false,
      type: DataType.DECIMAL(10, 2),
    });
  });

  test('create', async () => {
    const expected = {
      product_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      price: 1,
    };
    const product = await ProductModel.create(expected);
    expect(product.toJSON()).toStrictEqual(expected);
  });
});
