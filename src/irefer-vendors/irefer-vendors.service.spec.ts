import { Test, TestingModule } from '@nestjs/testing';
import { IreferVendorsService } from './irefer-vendors.service';

describe('IreferVendorsService', () => {
  let service: IreferVendorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IreferVendorsService],
    }).compile();

    service = module.get<IreferVendorsService>(IreferVendorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
