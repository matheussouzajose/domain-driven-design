import {
  IsNotEmpty,
  IsNumber,
  IsString, validateSync,
} from 'class-validator';

export type CreateProductInputConstructorProps = {
  name: string;
  price: number;
};

export class CreateProductInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(props: CreateProductInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.price = props.price;
  }
}

export class ValidateCreateProductInput {
  static validate(input: CreateProductInput) {
    return validateSync(input);
  }
}