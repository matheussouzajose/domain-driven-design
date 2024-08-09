import { ProductService } from '@core/product/domain/service/product.service';
import { ProductFakeBuilder } from '@core/product/domain/entity/product-fake.builder';

describe('Product Service Unit Test', () => {
  test('Should be increase price', () => {
    const products = ProductFakeBuilder.aProducts(2).withPrice(100).build();
    ProductService.increasePrice(products, 10);
    expect(products[0].price).toBe(110);
  });
});
