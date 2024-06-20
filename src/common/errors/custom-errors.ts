export class ProductNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundException';
  }
}

export class InvalidProductIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProductIdException';
  }
}
export class VendorNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendorNotFoundException';
  }
}

export class ProductSlugNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductSlugNotFound';
  }
}

export class InvalidUrl extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUrl';
  }
}

export class MissingEnvironmentVariableException extends Error {
  constructor(variableName: string) {
    super(`Missing environment variable: ${variableName}`);
    this.name = 'MissingEnvironmentVariableException';
  }
}

export class InvalidReferralCode extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReferralCode';
  }
}

export class InvalidApiResponseType extends Error {
  public validationErrors: string[];

  constructor(message: string) {
    super(message);
    this.name = 'InvalidApiResponseType';
  }
}

export class InvalidArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';
  }
}