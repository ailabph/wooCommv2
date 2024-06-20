import { Test, TestingModule } from '@nestjs/testing';
import { IreferProductsService } from './irefer-products.service';

describe('IreferProductsService', () => {
  let service: IreferProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IreferProductsService],
    }).compile();

    service = module.get<IreferProductsService>(IreferProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
