import { Test, TestingModule } from '@nestjs/testing';
import { IreferVendorsController } from './irefer-vendors.controller';
import { IreferVendorsService } from './irefer-vendors.service';

describe('IreferVendorsController', () => {
  let controller: IreferVendorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IreferVendorsController],
      providers: [IreferVendorsService],
    }).compile();

    controller = module.get<IreferVendorsController>(IreferVendorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
