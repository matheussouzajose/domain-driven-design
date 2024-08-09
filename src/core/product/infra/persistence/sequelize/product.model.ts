import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type ProductModelProps = {
  product_id: string;
  name: string;
  price: number;
};

@Table({ tableName: 'products', timestamps: false })
export class ProductModel extends Model<ProductModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare product_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
  declare price: number;
}
