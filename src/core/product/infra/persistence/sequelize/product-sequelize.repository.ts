import { literal, Op } from 'sequelize';
import { SortDirection } from '@core/shared/domain/value-object/search-params.vo';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidArgumentError } from '@core/shared/domain/errors/invalid-argument.error';
import {
  IProductRepository,
  ProductSearchParams,
  ProductSearchResult,
} from '@core/product/domain/repository/product.repository.interface';
import { ProductModel } from '@core/product/infra/persistence/sequelize/product.model';
import {
  Product,
  ProductId,
} from '@core/product/domain/entity/product.aggregate';
import { ProductModelMapper } from '@core/product/infra/persistence/sequelize/product-model.mapper';
import { UnitOfWorkSequelize } from '@core/shared/infra/persistence/sequelize/unit-of-work-sequelize';

export class ProductSequelizeRepository implements IProductRepository {
  sortableFields: string[] = ['name'];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(
    private productModel: typeof ProductModel,
    private uow: UnitOfWorkSequelize,
  ) {}

  async insert(entity: Product): Promise<void> {
    const modelProps = ProductModelMapper.toModel(entity);
    await this.productModel.create(modelProps.toJSON(), {
      transaction: this.uow.getTransaction(),
    });
    this.uow.addAggregateRoot(entity);
  }

  async bulkInsert(entities: Product[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      ProductModelMapper.toModel(entity).toJSON(),
    );
    await this.productModel.bulkCreate(modelsProps, {
      transaction: this.uow.getTransaction(),
    });
    entities.forEach((e) => this.uow.addAggregateRoot(e));
  }

  async update(entity: Product): Promise<void> {
    const id = entity.product_id.id;
    const modelProps = ProductModelMapper.toModel(entity);
    const [affectedRows] = await this.productModel.update(modelProps.toJSON(), {
      where: { product_id: entity.product_id.id },
      transaction: this.uow.getTransaction(),
    });
    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
    this.uow.addAggregateRoot(entity);
  }

  async delete(productId: ProductId): Promise<void> {
    const id = productId.id;
    const affectedRows = await this.productModel.destroy({
      where: { product_id: id },
      transaction: this.uow.getTransaction(),
    });
    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findByIds(ids: ProductId[]): Promise<Product[]> {
    const models = await this.productModel.findAll({
      where: {
        product_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      transaction: this.uow.getTransaction(),
    });
    return models.map((m) => ProductModelMapper.toEntity(m));
  }

  async existsById(
    ids: ProductId[],
  ): Promise<{ exists: ProductId[]; not_exists: ProductId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }
    const existsProductModels = await this.productModel.findAll({
      attributes: ['product_id'],
      where: {
        product_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      transaction: this.uow.getTransaction(),
    });
    const existsProductIds = existsProductModels.map(
      (m) => new ProductId(m.product_id),
    );
    const notExistsProductIds = ids.filter(
      (id) => !existsProductIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsProductIds,
      not_exists: notExistsProductIds,
    };
  }

  async findById(entity_id: ProductId): Promise<Product | null> {
    const model = await this.productModel.findByPk(entity_id.id);
    return model ? ProductModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Product[]> {
    const models = await this.productModel.findAll({
      transaction: this.uow.getTransaction(),
    });
    return models.map((model) => {
      return ProductModelMapper.toEntity(model);
    });
  }

  async search(props: ProductSearchParams): Promise<ProductSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.productModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir!) }
        : { order: [['name', 'desc']] }),
      offset,
      limit,
      transaction: this.uow.getTransaction(),
    });
    return new ProductSearchResult({
      items: models.map((model) => {
        return ProductModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.productModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => Product {
    return Product;
  }
}
