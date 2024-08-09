import { ValueObject } from '@core/shared/domain/value-object/value-object';
import { validateSync, IsNotEmpty, Min } from 'class-validator';
import { Either } from '@core/shared/domain/either';

const GROUPS = ['street', 'number', 'zip', 'city', 'state'];

export class AddressRules {
  @IsNotEmpty({ groups: ['street'] })
  street: string;

  @Min(1, { groups: ['number'] })
  number: number;

  @IsNotEmpty({ groups: ['zip'] })
  zip: string;

  @IsNotEmpty({ groups: ['city'] })
  city: string;

  @IsNotEmpty({ groups: ['state'] })
  state: string;

  constructor(vo: Address) {
    Object.assign(this, vo);
  }
}

export class Address extends ValueObject {
  private constructor(
    readonly street: string,
    readonly number: number,
    readonly zip: string,
    readonly city: string,
    readonly state: string,
    readonly complement?: string,
  ) {
    super();
    this.validate();
  }

  private validate(): void {
    const errors = validateSync(new AddressRules(this), { groups: GROUPS });
    if (errors.length) {
      for (const error of errors) {
        Object.values(error.constraints!).forEach((message) => {
          throw new InvalidAddressError(message);
        });
      }
    }
  }

  static create(
    street: string,
    number: number,
    zip: string,
    city: string,
    state: string,
    complement?: string,
  ): Either<Address, InvalidAddressError> {
    return Either.safe(
      () => new Address(street, number, zip, city, state, complement),
    );
  }
}

export class InvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAddressError';
  }
}
