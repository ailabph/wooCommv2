import { Test, TestingModule } from '@nestjs/testing';
import { IreferProductsController } from './irefer-products.controller';
import { IreferProductsService } from './irefer-products.service';

describe('IreferProductsController', () => {
  let controller: IreferProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IreferProductsController],
      providers: [IreferProductsService],
    }).compile();

    controller = module.get<IreferProductsController>(IreferProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
