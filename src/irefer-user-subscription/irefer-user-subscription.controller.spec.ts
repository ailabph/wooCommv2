import { Test, TestingModule } from '@nestjs/testing';
import { IreferUserSubscriptionController } from './irefer-user-subscription.controller';
import { IreferUserSubscriptionService } from './irefer-user-subscription.service';

describe('IreferUserSubscriptionController', () => {
  let controller: IreferUserSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IreferUserSubscriptionController],
      providers: [IreferUserSubscriptionService],
    }).compile();

    controller = module.get<IreferUserSubscriptionController>(IreferUserSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
